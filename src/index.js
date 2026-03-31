// Main entry point for the LinkedIn Agent application
console.log('Welcome to LinkedIn Agent!');

// Example function
export const greet = (name) => {
  return `Hello, ${name}!`;
};

export {
  LinkedInProfile,
  LinkedInPost,
  ConnectionManager,
  JobSearchAgent,
  MessagingAgent,
} from './linkedin-agent.js';

export default {
  greet,
};