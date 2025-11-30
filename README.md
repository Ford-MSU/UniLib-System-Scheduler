<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/17D3R1WfOxHZH3qw5n4EHwM0b2ZQTJeoC

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


**How to update code:**


1. Make your changes.
   Edit your code in VSCode and save the files.
2. Update the Live Site.
   Run this command in your VSCode Terminal:
   `npm run deploy`
3. Save your Source Code.
   `git add .`
   `git commit -m "Description of what I changed"`
   `git push`
