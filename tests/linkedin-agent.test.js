import {
  LinkedInProfile,
  LinkedInPost,
  ConnectionManager,
  JobSearchAgent,
  MessagingAgent,
} from '../src/linkedin-agent.js';

describe('LinkedInProfile', () => {
  test('should create a profile with required fields', () => {
    const profile = new LinkedInProfile({ name: 'Alice', headline: 'Engineer' });
    expect(profile.name).toBe('Alice');
    expect(profile.headline).toBe('Engineer');
    expect(profile.experience).toEqual([]);
    expect(profile.skills).toEqual([]);
  });

  test('should throw if name is missing', () => {
    expect(() => new LinkedInProfile({})).toThrow('Profile name is required');
  });

  test('should return a formatted profile summary', () => {
    const profile = new LinkedInProfile({
      name: 'Bob',
      headline: 'Developer',
      experience: [{ title: 'Dev', company: 'Acme' }],
      skills: ['JavaScript'],
    });
    expect(profile.getProfileSummary()).toBe('Bob - Developer | 1 experience(s), 1 skill(s)');
  });

  test('should add a skill without duplicates', () => {
    const profile = new LinkedInProfile({ name: 'Carol' });
    profile.addSkill('Python');
    profile.addSkill('Python');
    expect(profile.skills).toEqual(['Python']);
  });

  test('should throw when adding an invalid skill', () => {
    const profile = new LinkedInProfile({ name: 'Dave' });
    expect(() => profile.addSkill('')).toThrow('Skill must be a non-empty string');
  });

  test('should add experience', () => {
    const profile = new LinkedInProfile({ name: 'Eve' });
    profile.addExperience({ title: 'Manager', company: 'Corp' });
    expect(profile.experience).toHaveLength(1);
    expect(profile.experience[0].title).toBe('Manager');
  });

  test('should throw when adding experience without title or company', () => {
    const profile = new LinkedInProfile({ name: 'Frank' });
    expect(() => profile.addExperience({ title: '' })).toThrow(
      'Experience must include title and company'
    );
  });
});

describe('LinkedInPost', () => {
  test('should create a post with content and author', () => {
    const post = new LinkedInPost({ content: 'Hello world', author: 'Alice' });
    expect(post.content).toBe('Hello world');
    expect(post.author).toBe('Alice');
    expect(post.likes).toBe(0);
    expect(post.comments).toEqual([]);
  });

  test('should throw if content is missing', () => {
    expect(() => new LinkedInPost({ author: 'Alice' })).toThrow('Post content is required');
  });

  test('should throw if author is missing', () => {
    expect(() => new LinkedInPost({ content: 'Hello' })).toThrow('Post author is required');
  });

  test('should format the post correctly', () => {
    const post = new LinkedInPost({
      content: 'My update',
      author: 'Bob',
      tags: ['tech', 'career'],
    });
    expect(post.format()).toBe('Bob: My update [tech, career]');
  });

  test('should format the post without tags', () => {
    const post = new LinkedInPost({ content: 'No tags', author: 'Carol' });
    expect(post.format()).toBe('Carol: No tags');
  });

  test('should add likes', () => {
    const post = new LinkedInPost({ content: 'Like me', author: 'Dave' });
    expect(post.addLike()).toBe(1);
    expect(post.addLike()).toBe(2);
  });

  test('should add a comment', () => {
    const post = new LinkedInPost({ content: 'Comment here', author: 'Eve' });
    post.addComment({ author: 'Frank', text: 'Nice post!' });
    expect(post.comments).toHaveLength(1);
    expect(post.comments[0].text).toBe('Nice post!');
  });

  test('should throw when adding an invalid comment', () => {
    const post = new LinkedInPost({ content: 'Test', author: 'Grace' });
    expect(() => post.addComment({ author: '', text: '' })).toThrow(
      'Comment must include author and text'
    );
  });
});

describe('ConnectionManager', () => {
  test('should send a connection request', () => {
    const cm = new ConnectionManager();
    const request = cm.sendRequest('Alice', 'Hi!');
    expect(request.target).toBe('Alice');
    expect(request.status).toBe('pending');
    expect(cm.pendingRequests).toHaveLength(1);
  });

  test('should throw when sending request without target', () => {
    const cm = new ConnectionManager();
    expect(() => cm.sendRequest('')).toThrow('Target name is required');
  });

  test('should accept a pending request', () => {
    const cm = new ConnectionManager();
    cm.sendRequest('Bob');
    const accepted = cm.acceptRequest('Bob');
    expect(accepted.status).toBe('accepted');
    expect(cm.getConnections()).toEqual(['Bob']);
    expect(cm.pendingRequests).toHaveLength(0);
  });

  test('should throw when accepting a non-existent request', () => {
    const cm = new ConnectionManager();
    expect(() => cm.acceptRequest('Nobody')).toThrow('No pending request found');
  });

  test('should return connection count', () => {
    const cm = new ConnectionManager();
    cm.sendRequest('Alice');
    cm.acceptRequest('Alice');
    cm.sendRequest('Bob');
    cm.acceptRequest('Bob');
    expect(cm.getConnectionCount()).toBe(2);
  });
});

describe('JobSearchAgent', () => {
  const sampleJobs = [
    { title: 'Software Engineer', location: 'San Francisco', remote: false, description: 'Build web apps' },
    { title: 'Data Scientist', location: 'New York', remote: true, description: 'Analyze data' },
    { title: 'Frontend Developer', location: 'Remote', remote: true, description: 'React and JavaScript' },
    { title: 'DevOps Engineer', location: 'Austin', remote: false, description: 'CI/CD pipelines' },
  ];

  test('should search by keyword', () => {
    const agent = new JobSearchAgent();
    const results = agent.search(sampleJobs, { keyword: 'engineer' });
    expect(results).toHaveLength(2);
  });

  test('should search by location', () => {
    const agent = new JobSearchAgent();
    const results = agent.search(sampleJobs, { location: 'New York' });
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('Data Scientist');
  });

  test('should search by remote flag', () => {
    const agent = new JobSearchAgent();
    const results = agent.search(sampleJobs, { remote: true });
    expect(results).toHaveLength(2);
  });

  test('should combine search criteria', () => {
    const agent = new JobSearchAgent();
    const results = agent.search(sampleJobs, { keyword: 'javascript', remote: true });
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe('Frontend Developer');
  });

  test('should return all jobs when no criteria given', () => {
    const agent = new JobSearchAgent();
    const results = agent.search(sampleJobs);
    expect(results).toHaveLength(4);
  });

  test('should throw when jobs is not an array', () => {
    const agent = new JobSearchAgent();
    expect(() => agent.search('not an array')).toThrow('Jobs must be an array');
  });

  test('should save a job', () => {
    const agent = new JobSearchAgent();
    agent.saveJob({ title: 'Test Job' });
    expect(agent.getSavedJobs()).toHaveLength(1);
  });

  test('should throw when saving a job without title', () => {
    const agent = new JobSearchAgent();
    expect(() => agent.saveJob({})).toThrow('Job must have a title');
  });

  test('should track search history', () => {
    const agent = new JobSearchAgent();
    agent.search(sampleJobs, { keyword: 'engineer' });
    agent.search(sampleJobs, { location: 'Austin' });
    expect(agent.searchHistory).toHaveLength(2);
  });
});

describe('MessagingAgent', () => {
  test('should send a message', () => {
    const agent = new MessagingAgent();
    const msg = agent.sendMessage('Alice', 'Hello!');
    expect(msg.to).toBe('Alice');
    expect(msg.text).toBe('Hello!');
    expect(msg.from).toBe('me');
  });

  test('should throw when contact is missing', () => {
    const agent = new MessagingAgent();
    expect(() => agent.sendMessage('', 'Hello')).toThrow('Contact name is required');
  });

  test('should throw when message text is missing', () => {
    const agent = new MessagingAgent();
    expect(() => agent.sendMessage('Alice', '')).toThrow('Message text is required');
  });

  test('should get conversation history', () => {
    const agent = new MessagingAgent();
    agent.sendMessage('Bob', 'Hi Bob');
    agent.sendMessage('Bob', 'How are you?');
    const convo = agent.getConversation('Bob');
    expect(convo).toHaveLength(2);
  });

  test('should return empty array for unknown contact', () => {
    const agent = new MessagingAgent();
    expect(agent.getConversation('Unknown')).toEqual([]);
  });

  test('should list contacts with conversations', () => {
    const agent = new MessagingAgent();
    agent.sendMessage('Alice', 'Hi');
    agent.sendMessage('Bob', 'Hey');
    expect(agent.getContacts()).toEqual(['Alice', 'Bob']);
  });
});
