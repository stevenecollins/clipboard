import { Router, Response } from 'express';
import { prisma } from '@/config/database';
import { ApiResponse, CreateItemRequest } from '@/types/api';
import { itemValidation } from '@/utils/validation';
import { authenticateToken, AuthRequest } from '@/middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Create new item
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = itemValidation.create.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        error: { message: error.details[0].message },
      });
      return;
    }

    const { boardId, title, sourceUrl, imageUrl, imageWidth, imageHeight }: CreateItemRequest = value;

    // Verify board belongs to user
    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
        userId: req.user!.id,
      },
    });

    if (!board) {
      res.status(404).json({
        success: false,
        error: { message: 'Board not found' },
      });
      return;
    }

    const item = await prisma.item.create({
      data: {
        boardId,
        title,
        sourceUrl,
        imageUrl: imageUrl || sourceUrl, // fallback to sourceUrl if no image
        imageWidth,
        imageHeight,
      },
    });

    const response: ApiResponse = {
      success: true,
      data: { item },
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
});

// Get specific item
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const item = await prisma.item.findFirst({
      where: {
        id: req.params.id,
        board: {
          userId: req.user!.id,
        },
      },
      include: {
        board: true,
      },
    });

    if (!item) {
      res.status(404).json({
        success: false,
        error: { message: 'Item not found' },
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      data: { item },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
});

// Update item
router.patch('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = itemValidation.update.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        error: { message: error.details[0].message },
      });
      return;
    }

    // Update item only if it belongs to user's board
    const item = await prisma.item.updateMany({
      where: {
        id: req.params.id,
        board: {
          userId: req.user!.id,
        },
      },
      data: value,
    });

    if (item.count === 0) {
      res.status(404).json({
        success: false,
        error: { message: 'Item not found' },
      });
      return;
    }

    // Get updated item
    const updatedItem = await prisma.item.findUnique({
      where: { id: req.params.id },
    });

    const response: ApiResponse = {
      success: true,
      data: { item: updatedItem },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
});

// Delete item
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const deleted = await prisma.item.deleteMany({
      where: {
        id: req.params.id,
        board: {
          userId: req.user!.id,
        },
      },
    });

    if (deleted.count === 0) {
      res.status(404).json({
        success: false,
        error: { message: 'Item not found' },
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      data: { message: 'Item deleted successfully' },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
});

export { router as itemsRouter };