/**
 * LinkedIn Agent - A module for automating LinkedIn interactions.
 *
 * Provides utilities for profile management, post creation,
 * connection handling, job search, and messaging.
 */

/**
 * Represents a LinkedIn user profile.
 */
export class LinkedInProfile {
  constructor({ name, headline, summary, experience = [], skills = [] }) {
    if (!name || typeof name !== 'string') {
      throw new Error('Profile name is required and must be a string');
    }
    this.name = name;
    this.headline = headline || '';
    this.summary = summary || '';
    this.experience = experience;
    this.skills = skills;
  }

  /**
   * Returns a formatted profile summary string.
   */
  getProfileSummary() {
    const expCount = this.experience.length;
    const skillCount = this.skills.length;
    return `${this.name} - ${this.headline} | ${expCount} experience(s), ${skillCount} skill(s)`;
  }

  /**
   * Adds a skill to the profile.
   */
  addSkill(skill) {
    if (!skill || typeof skill !== 'string') {
      throw new Error('Skill must be a non-empty string');
    }
    if (!this.skills.includes(skill)) {
      this.skills.push(skill);
    }
    return this.skills;
  }

  /**
   * Adds an experience entry to the profile.
   */
  addExperience({ title, company, duration }) {
    if (!title || !company) {
      throw new Error('Experience must include title and company');
    }
    this.experience.push({ title, company, duration: duration || '' });
    return this.experience;
  }
}

/**
 * Represents a LinkedIn post.
 */
export class LinkedInPost {
  constructor({ content, author, tags = [] }) {
    if (!content || typeof content !== 'string') {
      throw new Error('Post content is required and must be a string');
    }
    if (!author || typeof author !== 'string') {
      throw new Error('Post author is required and must be a string');
    }
    this.content = content;
    this.author = author;
    this.tags = tags;
    this.createdAt = new Date().toISOString();
    this.likes = 0;
    this.comments = [];
  }

  /**
   * Formats the post for display.
   */
  format() {
    const tagStr = this.tags.length > 0 ? ` [${this.tags.join(', ')}]` : '';
    return `${this.author}: ${this.content}${tagStr}`;
  }

  /**
   * Adds a like to the post.
   */
  addLike() {
    this.likes += 1;
    return this.likes;
  }

  /**
   * Adds a comment to the post.
   */
  addComment({ author, text }) {
    if (!author || !text) {
      throw new Error('Comment must include author and text');
    }
    this.comments.push({ author, text, createdAt: new Date().toISOString() });
    return this.comments;
  }
}

/**
 * LinkedIn Agent for managing connections.
 */
export class ConnectionManager {
  constructor() {
    this.connections = [];
    this.pendingRequests = [];
  }

  /**
   * Sends a connection request.
   */
  sendRequest(targetName, message = '') {
    if (!targetName || typeof targetName !== 'string') {
      throw new Error('Target name is required and must be a string');
    }
    const request = {
      target: targetName,
      message,
      status: 'pending',
      sentAt: new Date().toISOString(),
    };
    this.pendingRequests.push(request);
    return request;
  }

  /**
   * Accepts a pending connection request by target name.
   */
  acceptRequest(targetName) {
    const index = this.pendingRequests.findIndex(
      (r) => r.target === targetName && r.status === 'pending'
    );
    if (index === -1) {
      throw new Error(`No pending request found for ${targetName}`);
    }
    const request = this.pendingRequests[index];
    request.status = 'accepted';
    this.connections.push(targetName);
    this.pendingRequests.splice(index, 1);
    return request;
  }

  /**
   * Returns the list of connections.
   */
  getConnections() {
    return [...this.connections];
  }

  /**
   * Returns the count of connections.
   */
  getConnectionCount() {
    return this.connections.length;
  }
}

/**
 * LinkedIn Job Search agent.
 */
export class JobSearchAgent {
  constructor() {
    this.savedJobs = [];
    this.searchHistory = [];
  }

  /**
   * Searches for jobs based on criteria.
   * Returns a filtered list of matching jobs from the provided job listings.
   */
  search(jobs, { keyword, location, remote } = {}) {
    if (!Array.isArray(jobs)) {
      throw new Error('Jobs must be an array');
    }

    this.searchHistory.push({ keyword, location, remote, searchedAt: new Date().toISOString() });

    return jobs.filter((job) => {
      let match = true;
      if (keyword) {
        const kw = keyword.toLowerCase();
        match = match && (
          job.title.toLowerCase().includes(kw) ||
          (job.description && job.description.toLowerCase().includes(kw))
        );
      }
      if (location) {
        match = match && job.location &&
          job.location.toLowerCase().includes(location.toLowerCase());
      }
      if (remote !== undefined) {
        match = match && job.remote === remote;
      }
      return match;
    });
  }

  /**
   * Saves a job for later review.
   */
  saveJob(job) {
    if (!job || !job.title) {
      throw new Error('Job must have a title');
    }
    this.savedJobs.push({ ...job, savedAt: new Date().toISOString() });
    return this.savedJobs;
  }

  /**
   * Returns saved jobs.
   */
  getSavedJobs() {
    return [...this.savedJobs];
  }
}

/**
 * LinkedIn Messaging agent.
 */
export class MessagingAgent {
  constructor() {
    this.conversations = new Map();
  }

  /**
   * Sends a message to a contact.
   */
  sendMessage(contact, text) {
    if (!contact || typeof contact !== 'string') {
      throw new Error('Contact name is required and must be a string');
    }
    if (!text || typeof text !== 'string') {
      throw new Error('Message text is required and must be a string');
    }

    const message = {
      from: 'me',
      to: contact,
      text,
      sentAt: new Date().toISOString(),
    };

    if (!this.conversations.has(contact)) {
      this.conversations.set(contact, []);
    }
    this.conversations.get(contact).push(message);
    return message;
  }

  /**
   * Gets the conversation history with a contact.
   */
  getConversation(contact) {
    return this.conversations.get(contact) || [];
  }

  /**
   * Returns all contacts with active conversations.
   */
  getContacts() {
    return Array.from(this.conversations.keys());
  }
}
