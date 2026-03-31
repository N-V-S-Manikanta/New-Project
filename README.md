# LinkedIn Agent

A Node.js module for automating LinkedIn interactions including profile management, post creation, connection handling, job search, and messaging.

## Features

- **Profile Management** – Create and manage LinkedIn profiles with experience and skills
- **Post Creation** – Create, format, like, and comment on posts with tagging support
- **Connection Management** – Send, accept, and track connection requests
- **Job Search** – Search jobs by keyword, location, and remote status; save jobs for later
- **Messaging** – Send messages and track conversation history with contacts

## Getting Started

### Installation

```bash
npm install
```

### Usage

```javascript
import {
  LinkedInProfile,
  LinkedInPost,
  ConnectionManager,
  JobSearchAgent,
  MessagingAgent,
} from './src/index.js';

// Create a profile
const profile = new LinkedInProfile({
  name: 'Jane Doe',
  headline: 'Software Engineer',
  summary: 'Passionate about building great software',
});
profile.addSkill('JavaScript');
profile.addExperience({ title: 'Engineer', company: 'TechCorp', duration: '2 years' });
console.log(profile.getProfileSummary());

// Create a post
const post = new LinkedInPost({
  content: 'Excited to share my latest project!',
  author: 'Jane Doe',
  tags: ['tech', 'opensource'],
});
console.log(post.format());

// Manage connections
const connections = new ConnectionManager();
connections.sendRequest('John Smith', 'Let\'s connect!');
connections.acceptRequest('John Smith');
console.log(connections.getConnections());

// Search for jobs
const jobSearch = new JobSearchAgent();
const jobs = [
  { title: 'Frontend Developer', location: 'Remote', remote: true, description: 'React role' },
  { title: 'Backend Engineer', location: 'NYC', remote: false, description: 'Node.js role' },
];
const results = jobSearch.search(jobs, { keyword: 'developer', remote: true });
console.log(results);

// Send messages
const messaging = new MessagingAgent();
messaging.sendMessage('John Smith', 'Thanks for connecting!');
console.log(messaging.getConversation('John Smith'));
```

### Running Tests

```bash
npm test
```

## Project Structure

```
├── src/
│   ├── index.js              # Main entry point and exports
│   └── linkedin-agent.js     # Core LinkedIn agent classes
├── tests/
│   ├── index.test.js          # Tests for greet function
│   └── linkedin-agent.test.js # Tests for LinkedIn agent classes
├── package.json
├── README.md
├── CONTRIBUTING.md
└── LICENSE
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
