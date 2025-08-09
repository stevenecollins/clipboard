# Privacy & Legal Notes

## Privacy-First Philosophy

Clipboards is built with privacy as a core principle. All user content is private by default, and users maintain full control over their data.

## Data Collection & Usage

### What We Collect

#### Essential Data (Required for Service)
- **Account Information**: Email address, name, profile photo (optional)
- **Authentication Data**: Encrypted passwords, OAuth tokens
- **Content Data**: Saved images, URLs, board names, item titles
- **Usage Metadata**: Save timestamps, device sync information
- **Technical Data**: IP addresses (for security), device identifiers (for sync)

#### Analytics Data (Optional)
- **App Usage**: Feature usage patterns, performance metrics
- **Error Reports**: Crash logs, error messages (no personal content)
- **Engagement Metrics**: Session duration, feature adoption rates

### What We DON'T Collect
- **Personal Content**: We never analyze or scan saved images for content
- **Browsing History**: Only URLs explicitly saved by users
- **Third-Party Data**: No cross-site tracking or data broker partnerships
- **Sensitive Information**: No financial, health, or other sensitive personal data
- **Social Connections**: No access to contacts, social graphs, or relationships

### Data Usage Principles

#### Primary Uses
1. **Service Delivery**: Sync content across user devices
2. **Account Management**: Authentication and user preferences
3. **Feature Development**: Improve app functionality and user experience
4. **Security**: Detect and prevent fraud, abuse, and unauthorized access
5. **Support**: Respond to user inquiries and technical issues

#### We Never:
- Sell user data to third parties
- Share content with advertising networks
- Use saved content for AI training without explicit consent
- Access user content for any purpose other than technical support (when requested)

## Data Storage & Security

### Encryption
- **Data in Transit**: All API communications use TLS 1.3
- **Data at Rest**: Database encryption using AES-256
- **Image Storage**: S3 server-side encryption with customer-managed keys
- **Authentication**: Bcrypt password hashing, JWT token signing

### Data Location
- **Primary Storage**: United States (AWS us-east-1)
- **Backup Storage**: United States (AWS us-west-2)
- **CDN**: Global CloudFront distribution for image delivery
- **No International Transfers**: All data remains within US jurisdiction

### Access Controls
- **Employee Access**: Strictly need-to-know basis with audit logs
- **System Access**: Multi-factor authentication required
- **Data Access**: Automated systems only, no human content review
- **Audit Trail**: Complete logging of all data access events

## User Rights & Controls

### Data Access Rights
- **Export Data**: Complete data export in JSON format
- **View Activity**: See all account activity and sync history
- **Download Images**: Bulk download of all saved images
- **API Access**: Programmatic access to personal data (future feature)

### Data Control Rights
- **Delete Account**: Permanent deletion within 30 days
- **Selective Deletion**: Delete specific boards, items, or data types
- **Privacy Settings**: Control sync, analytics, and sharing preferences
- **Data Portability**: Export data in standard formats for migration

### Content Ownership
- **User Ownership**: Users retain all rights to their saved content
- **No License Grant**: Clipboards claims no ownership or license to user content
- **Respect Copyright**: Users responsible for respecting third-party copyrights
- **DMCA Compliance**: Process for handling copyright infringement claims

## Third-Party Services

### Essential Service Providers
- **Authentication**: Firebase Auth / Auth0 (privacy-compliant)
- **Cloud Infrastructure**: AWS (GDPR/CCPA compliant)
- **Error Monitoring**: Sentry (anonymized error reports only)
- **Email Service**: SendGrid (transactional emails only)

### Data Sharing
- **Subprocessors**: Limited to essential service providers only
- **Legal Requirements**: Only when required by valid legal process
- **Security Incidents**: May share anonymized threat intelligence
- **Business Transfer**: User data protected in any business transaction

### Third-Party Guarantees
- All service providers must provide equivalent privacy protections
- Data Processing Agreements (DPAs) with all subprocessors
- Regular privacy and security audits of third-party services
- Immediate notification of any third-party data incidents

## Legal Compliance

### Regulatory Compliance
- **GDPR**: Full compliance for European users
- **CCPA**: California Consumer Privacy Act compliance
- **COPPA**: No knowingly collecting data from children under 13
- **SOX**: Financial controls and data integrity standards

### International Considerations
- **Data Localization**: Respect local data residency requirements
- **Cross-Border Transfers**: Adequate safeguards for international users
- **Local Laws**: Compliance with applicable local privacy laws
- **Right to be Forgotten**: Honor deletion requests per local regulations

## Incident Response

### Data Breach Protocol
1. **Detection**: Automated monitoring and alerting systems
2. **Assessment**: Immediate impact assessment within 2 hours
3. **Containment**: Stop breach and secure systems within 4 hours
4. **Notification**: User notification within 72 hours if required
5. **Remediation**: Fix vulnerabilities and prevent recurrence
6. **Reporting**: Regulatory reporting as required by law

### User Notification
- **Immediate**: For high-risk breaches affecting authentication
- **Prompt**: For medium-risk breaches affecting personal data
- **Regular**: Annual transparency reports on security incidents
- **Clear Communication**: Plain language explanations of impacts

## Terms of Service Key Points

### Acceptable Use
- **Personal Use**: Service intended for personal, non-commercial use
- **Content Responsibility**: Users responsible for legality of saved content
- **Prohibited Content**: No illegal, harmful, or infringing content
- **Resource Limits**: Fair use policies for storage and bandwidth

### Service Availability
- **Best Effort**: Target 99.9% uptime, no absolute guarantees
- **Maintenance Windows**: Scheduled maintenance with advance notice
- **Data Backup**: Regular backups, user responsible for personal backups
- **Service Changes**: Right to modify features with reasonable notice

### Liability Limitations
- **Service Limitations**: No liability for service interruptions
- **Content Responsibility**: Users liable for content they save/share
- **Indirect Damages**: Limited liability for consequential damages
- **Maximum Liability**: Limited to fees paid in previous 12 months

## Cookie Policy

### Essential Cookies
- **Authentication**: Remember login status and user sessions
- **Security**: CSRF protection and secure session management
- **Functionality**: User preferences and settings
- **Performance**: Load balancing and service optimization

### Optional Cookies
- **Analytics**: Usage statistics and feature adoption (opt-in)
- **Marketing**: Performance of marketing campaigns (opt-in)
- **Personalization**: Customized user experience (opt-in)

### Cookie Controls
- **Granular Control**: Separate opt-in for each cookie category
- **Easy Management**: One-click cookie preference center
- **Respect Settings**: Honor browser Do Not Track settings
- **Regular Cleanup**: Automatic cleanup of expired cookies

## Updates to Privacy Policy

### Change Process
1. **Review**: Regular review of privacy practices and policies
2. **User Input**: Consider user feedback on privacy concerns
3. **Legal Review**: Legal team review of all policy changes
4. **Advance Notice**: 30-day notice for material changes
5. **Continued Use**: Continued use constitutes acceptance

### Version Control
- All versions archived and accessible to users
- Clear indication of what changed in each version
- Effective date clearly specified for all changes
- Grandfathering of certain terms for existing users when appropriate

## Contact Information

### Privacy Questions
- **Email**: privacy@clipboards.app
- **Response Time**: Within 48 hours for privacy inquiries
- **Escalation**: Direct access to Data Protection Officer

### Legal Inquiries
- **Email**: legal@clipboards.app  
- **Response Time**: Within 5 business days
- **Process Server**: Legal address provided in Terms of Service

### Data Subject Requests
- **Portal**: Self-service data request portal (future)
- **Email**: privacy@clipboards.app with subject "Data Request"
- **Verification**: Identity verification required for all requests
- **Timeline**: Fulfillment within 30 days per regulatory requirements

---

*This document is for internal planning purposes and does not constitute actual legal advice. Final privacy policy and terms of service should be reviewed by qualified legal counsel before publication.*