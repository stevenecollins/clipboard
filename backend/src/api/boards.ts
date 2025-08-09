import { Router, Response } from 'express';
import { prisma } from '@/config/database';
import { ApiResponse, CreateBoardRequest, UpdateBoardRequest } from '@/types/api';
import { boardValidation } from '@/utils/validation';
import { authenticateToken, AuthRequest } from '@/middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get all boards for user
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const boards = await prisma.board.findMany({
      where: { userId: req.user!.id },
      orderBy: [
        { position: 'asc' },
        { createdAt: 'desc' }
      ],
      include: {
        _count: {
          select: { items: true }
        }
      }
    });

    const response: ApiResponse = {
      success: true,
      data: { boards },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Get boards error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
});

// Create new board
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = boardValidation.create.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        error: { message: error.details[0].message },
      });
      return;
    }

    const { name, description, color }: CreateBoardRequest = value;

    const board = await prisma.board.create({
      data: {
        userId: req.user!.id,
        name,
        description,
        color,
      },
      include: {
        _count: {
          select: { items: true }
        }
      }
    });

    const response: ApiResponse = {
      success: true,
      data: { board },
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Create board error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
});

// Get specific board
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const board = await prisma.board.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      include: {
        items: {
          orderBy: [
            { position: 'asc' },
            { createdAt: 'desc' }
          ]
        }
      }
    });

    if (!board) {
      res.status(404).json({
        success: false,
        error: { message: 'Board not found' },
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      data: { board },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Get board error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
});

// Update board
router.patch('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { error, value } = boardValidation.update.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        error: { message: error.details[0].message },
      });
      return;
    }

    const updateData: UpdateBoardRequest = value;

    const board = await prisma.board.updateMany({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      data: updateData,
    });

    if (board.count === 0) {
      res.status(404).json({
        success: false,
        error: { message: 'Board not found' },
      });
      return;
    }

    // Get updated board
    const updatedBoard = await prisma.board.findUnique({
      where: { id: req.params.id },
      include: {
        _count: {
          select: { items: true }
        }
      }
    });

    const response: ApiResponse = {
      success: true,
      data: { board: updatedBoard },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Update board error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
});

// Delete board
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const deleted = await prisma.board.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    if (deleted.count === 0) {
      res.status(404).json({
        success: false,
        error: { message: 'Board not found' },
      });
      return;
    }

    const response: ApiResponse = {
      success: true,
      data: { message: 'Board deleted successfully' },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Delete board error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' },
    });
  }
});

export { router as boardsRouter };