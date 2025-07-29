# GitHub PR Review Agent Dashboard

A beautiful, real-time dashboard for monitoring and analyzing GitHub PR reviews. Built with React, TypeScript, and Supabase for seamless data management and live updates.

## ✨ Features

- **Real-time Updates** - Live dashboard that updates automatically when new reviews are added
- **Comprehensive Analytics** - Track review statistics, trends, and activity patterns
- **Interactive Review Cards** - Click to view detailed review information in a modal
- **Advanced Filtering** - Search reviews by content or PR number, filter by specific PRs
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **Clean UI** - Modern dark theme with blue accents for excellent user experience

## 📊 Dashboard Components

### Statistics Overview
- Total reviews count
- Daily, weekly, and monthly review metrics
- Average review length
- Top reviewed PRs

### Review Management
- Searchable and filterable review list
- Detailed review modal with full content
- Direct links to GitHub PRs
- Copy-to-clipboard functionality

### Real-time Features
- Live updates when new reviews are added
- Activity timeline
- Progress indicators

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd github-pr-review-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   
   Create a table named `GitHub PR Review Agent` with the following schema:
   ```sql
   CREATE TABLE "GitHub PR Review Agent" (
     id SERIAL PRIMARY KEY,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     pr_number INTEGER NOT NULL,
     review_body TEXT NOT NULL,
     pr_link TEXT NOT NULL
   );
   
   -- Enable Row Level Security
   ALTER TABLE "GitHub PR Review Agent" ENABLE ROW LEVEL SECURITY;
   
   -- Create policy for public read access (adjust as needed)
   CREATE POLICY "Allow public read access" ON "GitHub PR Review Agent"
     FOR SELECT USING (true);
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173` to view the dashboard.

## 🛠️ Built With

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend-as-a-Service for database and real-time features
- **Lucide React** - Beautiful, customizable icons
- **date-fns** - Modern JavaScript date utility library

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── LoadingSpinner.tsx
│   ├── ReviewDetail.tsx
│   ├── ReviewsList.tsx
│   └── StatCard.tsx
├── hooks/              # Custom React hooks
│   ├── usePRReviews.ts
│   └── useStats.ts
├── lib/                # Utilities and configurations
│   └── supabase.ts
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |

### Database Schema

The application expects a Supabase table with the following structure:

```typescript
type PRReview = {
  id: number
  created_at: string
  pr_number: number
  review_body: string
  pr_link: string
}
```

## 📱 Usage

1. **View Statistics** - The top section shows key metrics about your PR reviews
2. **Browse Reviews** - Scroll through the list of reviews with search and filter options
3. **View Details** - Click on any review card to see the full review content
4. **External Links** - Click the external link icon to open the PR in GitHub
5. **Real-time Updates** - The dashboard automatically updates when new reviews are added

## 🎨 Customization

### Styling
The project uses Tailwind CSS for styling. You can customize the theme by modifying:
- `tailwind.config.js` - Tailwind configuration
- `src/index.css` - Global styles

### Components
All components are modular and can be easily customized:
- `StatCard.tsx` - Statistics display cards
- `ReviewsList.tsx` - Review list with filtering
- `ReviewDetail.tsx` - Detailed review modal

## 🚀 Deployment

The project is configured for easy deployment to Netlify:

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/) for fast development
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons provided by [Lucide React](https://lucide.dev/)
- Backend powered by [Supabase](https://supabase.com/)

## 📞 Support

If you have any questions or need help setting up the project, please open an issue in the repository.

---

**Made with ❤️ for better PR review management**