# Security Guide

## API Key Management

### ⚠️ IMPORTANT: Never commit API keys to version control!

This project uses OpenAI API keys for functionality. Here are the proper ways to handle API keys:

### 1. Environment Variables (Recommended)

Set your API key as an environment variable:

```bash
export OPENAI_API_KEY=your_actual_api_key_here
```

### 2. .env File (Local Development)

For local development, you can use a `.env` file:

1. Copy the example file:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` and add your actual API key:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

3. The `.env` file is already in `.gitignore` and will not be committed.

### 3. Production Deployment

For production environments:

- Use your platform's environment variable system (Heroku, Vercel, AWS, etc.)
- Never hardcode API keys in your source code
- Use secret management services when available

## What to do if you accidentally commit an API key

1. **Immediately revoke the exposed API key** in your OpenAI dashboard
2. **Generate a new API key** to replace the compromised one
3. **Remove the key from your commit history** using:
   ```bash
   git filter-branch --force --index-filter \
   'git rm --cached --ignore-unmatch path/to/file/with/key' \
   --prune-empty --tag-name-filter cat -- --all
   ```
4. **Force push** to update the remote repository:
   ```bash
   git push origin --force
   ```

## Best Practices

- ✅ Use environment variables
- ✅ Use `.env` files for local development
- ✅ Keep `.env` in `.gitignore`
- ✅ Use `env.example` for documentation
- ❌ Never hardcode API keys in source code
- ❌ Never commit API keys to version control
- ❌ Never share API keys in public repositories

## Security Checklist

Before pushing code:

- [ ] No API keys in source code
- [ ] `.env` file is in `.gitignore`
- [ ] `env.example` contains only placeholders
- [ ] All sensitive data is properly handled
