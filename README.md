# VIT Papers Retrieval System

A full-stack web application that aggregates and searches previous year question papers for VIT University from multiple sources including GitHub repositories and the CodeChef-VIT Papers API.

## 🎯 Project Overview

This application provides students with a centralized platform to search and download previous year question papers across multiple sources, making exam preparation more efficient and accessible. The system integrates with external APIs to provide real-time access to the latest papers.

## 🏗️ Tech Stack

### Frontend
- **HTML5/CSS3**: Responsive UI with modern gradient design
- **Vanilla JavaScript**: Dynamic content rendering and API communication

### Backend
- **Node.js**: Runtime environment (v16+)
- **Express.js**: RESTful API framework
- **Axios**: HTTP client for external API integration
- **CORS**: Cross-origin resource sharing enabled

### External Integrations
- **GitHub REST API**: Fetches papers from public repositories
- **CodeChef-VIT Papers API**: Access to structured paper database

### Deployment
- **Vercel**: Serverless deployment platform

## 📁 Project Structure

```
vit-papers-retrieval/
├── frontend/
│   └── index.html          # Frontend interface
├── server.js               # Express server & API routes
├── github_papers.js        # GitHub API integration module
├── codechef_papers.js      # CodeChef API integration module
├── package.json            # Dependencies & scripts
├── package-lock.json       # Locked dependency versions
├── vercel.json            # Vercel deployment configuration
├── .gitignore             # Git ignore rules
├── .env                   # Environment variables (not in repo)
└── README.md              # Documentation
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js v16 or higher
- npm package manager
- Git

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/AYUSH27102004/vit-papers-retrieval.git
cd vit-papers-retrieval
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
Create a `.env` file in the root directory:
```env
PORT=5000
GITHUB_TOKEN=your_github_personal_access_token_optional
```

**Note**: GitHub token is optional but recommended to avoid rate limiting (60 requests/hour without token vs 5000 with token).

**To get GitHub token:**
- Go to GitHub Settings → Developer Settings → Personal Access Tokens → Generate new token
- Select `public_repo` scope
- Copy the token and add to `.env`

4. **Start the server**

For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

5. **Access the application**
- Open browser: `http://localhost:5000`
- API Health Check: `http://localhost:5000/api/health`

### Deployment on Vercel

1. Push code to GitHub
2. Import project on Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## 📡 API Endpoints

### 1. Health Check
```
GET /api/health
```
Returns server status and timestamp.

**Response:**
```json
{
  "status": "Server is running",
  "timestamp": "2024-11-28T10:30:00.000Z"
}
```

### 2. GitHub Papers Search
```
GET /api/github/search
```

**Query Parameters:**
- `courseCode` (optional): Course code (e.g., CSE1001, MAT2001)
- `courseName` (required): Subject name or keywords
- `paperType` (optional): CAT1, CAT2, FAT, or all (default: all)

**Example:**
```
GET /api/github/search?courseCode=CSE1001&courseName=Data%20Structures&paperType=CAT1
```

**Response:**
```json
{
  "success": true,
  "source": "GitHub",
  "count": 5,
  "papers": [
    {
      "filename": "CSE1001_CAT1_2023.pdf",
      "title": "CSE1001_CAT1_2023",
      "courseCode": "CSE1001",
      "examType": "CAT1",
      "year": "2023",
      "subject": "Data Structures",
      "downloadUrl": "https://...",
      "source": "GitHub"
    }
  ]
}
```

### 3. CodeChef Papers Search
```
GET /api/codechef/search
```

**Query Parameters:** Same as GitHub endpoint

**Example:**
```
GET /api/codechef/search?courseName=Cloud%20Computing&paperType=FAT
```

**Response:**
```json
{
  "success": true,
  "source": "CodeChef-VIT",
  "count": 3,
  "papers": [
    {
      "subject": "Cloud Computing [CSE4009]",
      "exam": "FAT",
      "year": "2023",
      "courseCode": "CSE4009",
      "file_url": "https://...",
      "thumbnail_url": "https://...",
      "source": "CodeChef-VIT"
    }
  ]
}
```

### 4. Combined Search
```
GET /api/search
```

Searches both GitHub and CodeChef sources simultaneously.

**Query Parameters:**
- `courseCode` (optional)
- `courseName` (required)
- `paperType` (optional)
- `source` (optional): github, codechef, or all (default: all)

## 🎨 Features

### Core Functionality
✅ **Multi-source Aggregation**: Searches GitHub and CodeChef simultaneously  
✅ **Advanced Filtering**: Filter by course code, course name, and paper type  
✅ **Source Selection**: Choose between GitHub, CodeChef, or both  
✅ **Real-time Search**: Instant results from external APIs  
✅ **Direct Downloads**: One-click download links for all papers  
✅ **Responsive Design**: Works on desktop, tablet, and mobile  

### Technical Features
✅ **API Caching**: 1-hour cache for GitHub responses to minimize rate limiting  
✅ **Rate Limit Handling**: Automatic retry logic with cooldown periods  
✅ **Error Resilience**: Continues searching if one source fails  
✅ **Smart Parsing**: Extracts metadata from filenames automatically  
✅ **CORS Enabled**: Can be accessed from any domain  

### User Interface
✅ **Modern Gradient Design**: Eye-catching blue gradient theme  
✅ **Card-based Layout**: Clean grid view of search results  
✅ **Loading States**: Visual feedback during searches  
✅ **Error Messages**: Clear error notifications  
✅ **Source Badges**: Visual indicators for paper sources  

## 📸 Screenshots

### Homepage - Search Interface
The main search form allows users to select their preferred paper source and filter by course details.

### Search Results
Papers are displayed in a responsive grid with download buttons and metadata.

### Source Selection
Dropdown menu lets users choose between GitHub Papers, CodeChef Papers, or view both.

## 🎬 Demo Video

**Watch the demo:** [2-minute walkthrough showing search and download functionality]

## 🔧 Technical Implementation

### Caching Strategy
```javascript
// 1-hour cache for GitHub API responses
const CACHE_DURATION = 3600000; // milliseconds
```

This reduces API calls and prevents rate limiting issues.

### Rate Limit Management
```javascript
// Handles GitHub rate limits automatically
// Stores retry timestamp and returns cached error
```

### Filename Parsing
The system intelligently extracts:
- Course codes (e.g., CSE1001, MAT2001)
- Exam types (CAT1, CAT2, FAT)
- Years (2020-2024)
- Terms (Fall, Winter, Summer)

### Error Handling
```javascript
// Graceful degradation - if one source fails, others continue
// User sees available results from working sources
```

## 🎯 Design Decisions & Assumptions

### Architecture Choices

1. **No Database**: 
   - Papers are fetched in real-time from source APIs
   - Ensures users always get the latest papers
   - Reduces infrastructure complexity
   - Uses in-memory caching for performance

2. **Vanilla JavaScript Frontend**:
   - Fast loading without framework overhead
   - Demonstrates core JavaScript proficiency
   - Easy to understand and modify
   - No build process required

3. **Multi-source Integration**:
   - Gives users access to multiple paper repositories
   - Increases paper availability and variety
   - Provides redundancy if one source is down

4. **RESTful API Design**:
   - Clean, standard endpoint structure
   - Easy to extend with new sources
   - Can be consumed by mobile apps or other clients

### Assumptions

- Users have internet connection to access external APIs
- GitHub and CodeChef APIs remain publicly accessible
- Course codes follow standard VIT format (e.g., CSE1001)
- Papers are available in PDF or DOCX format

## 📊 Data Sources

### GitHub Repository
- **Repo**: `puneet-chandna/VIT-PYQPs-Paaji`
- **Structure**: Papers organized in subject folders
- **Formats**: PDF, DOCX
- **Coverage**: Multiple years and exam types

### CodeChef-VIT API
- **Endpoint**: `https://papers.codechefvit.com/api`
- **Features**: Structured metadata, thumbnails, answer key info
- **Format**: JSON responses
- **Coverage**: Recent papers with detailed information

## 🚧 Current Limitations

### Known Limitations
1. **No Persistent Storage**: Papers not cached locally, fetched on every search
2. **No User Accounts**: No login system or personalization
3. **No Favorites**: Cannot save preferred papers
4. **No Upload Feature**: Cannot contribute new papers
5. **Basic Frontend**: Vanilla JS instead of React/Vue/Angular
6. **No Offline Mode**: Requires internet connection

### Performance Considerations
- GitHub API: 60 requests/hour (unauthenticated) or 5000/hour (with token)
- CodeChef API: No documented rate limits
- Cache duration: 1 hour for GitHub responses

## 🔮 Future Enhancements

### Planned Improvements
- [ ] **Database Integration**: Add SQLite/PostgreSQL for caching and user data
- [ ] **User Authentication**: JWT-based login system
- [ ] **User Profiles**: Save searches, favorites, and preferences
- [ ] **Frontend Framework**: Migrate to React for better state management
- [ ] **Paper Preview**: View papers before downloading
- [ ] **Upload Feature**: Allow users to contribute papers
- [ ] **Rating System**: Community ratings and reviews
- [ ] **Advanced Filters**: Filter by year, semester, professor
- [ ] **Mobile App**: React Native or Flutter version
- [ ] **Email Alerts**: Notifications for new papers

## 📝 NPM Scripts

```bash
# Start production server
npm start

# Start development server with auto-reload
npm run dev
```

## 🐛 Troubleshooting

### Issue: Port Already in Use
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5000   # Windows
```

### Issue: GitHub Rate Limit Exceeded
**Solution**: Add GitHub token to `.env` file or wait for rate limit reset (shown in error message)

### Issue: Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: CORS Errors
**Solution**: Ensure CORS is enabled in `server.js` (already configured)

## 📄 License

ISC License - Free to use and modify

## 👨‍💻 Author

**Ayush Jha**
- GitHub: [@AYUSH27102004](https://github.com/AYUSH27102004)
- Email: ayushj2709@gmail.com

## 🙏 Acknowledgments

- VIT University community
- CodeChef-VIT for their public API
- Contributors to the GitHub papers repository
- Express.js and Node.js communities

---

**Project Status**: Production Ready ✅  
**Last Updated**: November 2024  
**Version**: 1.0.0
