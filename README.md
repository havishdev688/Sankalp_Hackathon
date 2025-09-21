# Dark Pattern Shield - User Protection Platform

## Problem Statement

Many apps and websites use dark UX patterns like hidden cancellation options, forced auto-renewals, and misleading language to trap users in unwanted subscriptions. These deceptive designs may boost profits temporarily but damage trust and user satisfaction. Hidden costs, trick questions, and confirmshaming are common tactics that frustrate users and reduce brand credibility.

## Solution

Dark Pattern Shield is a comprehensive user protection platform that:

- **Detects** dark patterns in real-time as users browse
- **Warns** users about deceptive subscription practices
- **Assists** with subscription cancellation and management
- **Educates** users about identifying and avoiding dark patterns
- **Reports** companies using deceptive practices
- **Provides** tools to escape subscription traps

## Key Features

### 🛡️ Real-Time Protection
- Browser extension for instant dark pattern detection
- Warning alerts when encountering deceptive practices
- Automatic detection of hidden costs and misleading language

### 🚪 Cancellation Assistant
- Step-by-step guides for canceling difficult subscriptions
- Direct links to cancellation pages
- Template emails for subscription disputes
- Legal rights information

### 📚 Education Center
- Interactive tutorials on identifying dark patterns
- Common deceptive tactics explained
- Best practices for subscription management
- Consumer rights and legal protections

### 📊 Company Accountability
- Public database of companies using dark patterns
- User reports and evidence collection
- Impact scoring and severity ratings
- Regulatory reporting tools

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Authentication)
- **Real-time**: WebSocket connections for live alerts
- **Browser Extension**: Manifest V3 for Chrome/Firefox

## External APIs Used

### Pattern Analysis APIs
- **APIFlash** (`https://api.apiflash.com/v1/urltoimage`) - Website screenshot capture
- **AllOrigins** (`https://api.allorigins.win/get`) - CORS proxy for webpage metadata
- **Clearbit** (`https://autocomplete.clearbit.com/v1/companies/suggest`) - Company information lookup

### Image Analysis APIs
- **OCR.space** (`https://api.ocr.space/parse/image`) - Text extraction from images
- **API Ninjas** (`https://api.api-ninjas.com/v1/imagetotext`) - Alternative OCR service

### Image Upload APIs
- **ImgBB** (`https://api.imgbb.com/1/upload`) - Free image hosting service
- **Imgur** (`https://api.imgur.com/3/image`) - Fallback image hosting

### Placeholder Services
- **Via Placeholder** (`https://via.placeholder.com/`) - Placeholder images for demos

### API Features
- **Free Tier Usage**: All APIs use free tiers or demo keys for development
- **Fallback System**: Multiple API fallbacks ensure reliability
- **Sample Data**: Comprehensive sample data when APIs are unavailable
- **Rate Limiting**: Built-in handling for API rate limits
- **Error Handling**: Graceful degradation when services are down

## Quick Start

```sh
# Clone the repository
git clone <YOUR_GIT_URL>
cd dark-pattern-shield

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase credentials and API keys

# Start development server
npm run dev

# Build browser extension
npm run build:extension
```

## Environment Variables

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Keys (Optional - fallback to demo/free tiers)
VITE_OCR_API_KEY=your_ocr_space_key
VITE_IMGBB_API_KEY=your_imgbb_key
VITE_IMGUR_CLIENT_ID=your_imgur_client_id
VITE_CLEARBIT_API_KEY=your_clearbit_key
```

## Development

```sh
# Development server
npm run dev

# Build for production
npm run build

# Build browser extension
npm run build:extension

# Run tests
npm run test

# Lint code
npm run lint
```

## Browser Extension

The platform includes a browser extension that:
- Scans web pages for dark patterns
- Shows warning overlays on problematic sites
- Provides quick access to cancellation tools
- Reports new dark patterns to the database

## Internal API Services

### Backend API (`backendAPI.ts`)
- **Pattern Management**: CRUD operations for dark patterns
- **User Data**: User statistics and protection scores
- **Real-time Events**: Live notifications and updates
- **Company Data**: Company accountability tracking
- **Cancellation Guides**: Subscription cancellation assistance
- **Search & Filtering**: Pattern search and categorization

### Pattern Analysis API (`patternAnalysisAPI.ts`)
- **URL Analysis**: Detect patterns from website URLs
- **Company Lookup**: Get company information from domains
- **Pattern Validation**: Validate and enhance pattern submissions
- **Screenshot Analysis**: Capture and analyze website screenshots
- **Risk Assessment**: Calculate pattern severity and user impact

### Image Analysis API (`imageAnalysisAPI.ts`)
- **OCR Processing**: Extract text from uploaded images
- **UI Element Detection**: Identify buttons, forms, and suspicious elements
- **Dark Pattern Recognition**: Detect hidden costs, auto-renewal, misleading language
- **Risk Scoring**: Calculate overall risk scores for detected patterns
- **Analysis Reports**: Generate detailed pattern analysis reports

### Browser Scan API (`browserScanAPI.ts`)
- **DOM Analysis**: Scan current webpage for dark patterns
- **Element Detection**: Find hidden costs, pre-checked options, misleading text
- **Real-time Scanning**: Live detection as users browse
- **Pattern Classification**: Categorize detected patterns by type and severity

### Dashboard API (`dashboardAPI.ts`)
- **User Statistics**: Personal protection scores and activity
- **Pattern Insights**: User-specific pattern detection history
- **Recommendations**: Personalized protection recommendations
- **Activity Tracking**: Monitor user engagement and protection effectiveness

### Image Upload API (`imageUploadAPI.ts`)
- **Multi-service Upload**: Upload to ImgBB, Imgur with fallbacks
- **Image Validation**: File type and size validation
- **Image Compression**: Optimize images before upload
- **Data URL Fallback**: Local preview when upload services fail

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - See LICENSE file for details

## API Rate Limits & Usage

### Free Tier Limits
- **OCR.space**: 25,000 requests/month
- **ImgBB**: Unlimited with demo key
- **Imgur**: 12,500 requests/day
- **APIFlash**: 100 requests/month (demo)
- **Clearbit**: 20 requests/hour

### Fallback Strategy
1. **Primary API**: Attempt main service
2. **Secondary API**: Try alternative service
3. **Sample Data**: Use realistic sample data
4. **Local Processing**: Client-side analysis when possible

## Application Workflow

### 1. User Protection Flow
```
User visits website → Browser extension scans DOM → Detects dark patterns → Shows warning overlay → User makes informed decision
```

### 2. Pattern Reporting Flow
```
User encounters pattern → Takes screenshot → Submits report → AI analyzes image → Pattern validated → Added to database → Community notified
```

### 3. URL Analysis Workflow
```
User enters URL → Fetch webpage metadata → Capture screenshot → Analyze content → Detect patterns → Generate risk score → Display results
```

### 4. Image Analysis Pipeline
```
Image uploaded → OCR text extraction → UI element detection → Pattern recognition → Risk assessment → Generate report
```

### 5. Cancellation Assistant Flow
```
User selects company → Load cancellation guide → Show step-by-step instructions → Provide contact info → Generate email template → Track cancellation
```

### 6. Real-time Protection System
```
Background scanner → DOM monitoring → Pattern detection → Risk evaluation → User notification → Action recommendations
```

### 7. Data Processing Architecture
```
API Request → Rate limiting → Primary service → Fallback service → Sample data → Response formatting → Client delivery
```

## Support

- Documentation: [docs.darkpatternshield.com](https://docs.darkpatternshield.com)
- Community: [Discord Server](https://discord.gg/darkpatternshield)
- Issues: [GitHub Issues](https://github.com/darkpatternshield/issues)
- API Status: [status.darkpatternshield.com](https://status.darkpatternshield.com)
