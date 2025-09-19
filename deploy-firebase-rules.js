#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔥 Firebase Rules Deployment Script');
console.log('=====================================\n');

// Check if Firebase CLI is installed
try {
  execSync('firebase --version', { stdio: 'pipe' });
  console.log('✅ Firebase CLI is installed');
} catch (error) {
  console.log('❌ Firebase CLI not found. Installing...');
  try {
    execSync('npm install -g firebase-tools', { stdio: 'inherit' });
    console.log('✅ Firebase CLI installed successfully');
  } catch (installError) {
    console.error('❌ Failed to install Firebase CLI. Please install manually:');
    console.error('   npm install -g firebase-tools');
    process.exit(1);
  }
}

// Check if user is logged in
try {
  execSync('firebase projects:list', { stdio: 'pipe' });
  console.log('✅ Firebase authentication verified');
} catch (error) {
  console.log('❌ Not logged in to Firebase. Please run:');
  console.log('   firebase login');
  process.exit(1);
}

// Check if firebase.json exists
if (!fs.existsSync('firebase.json')) {
  console.log('❌ firebase.json not found. Please run:');
  console.log('   firebase init');
  process.exit(1);
}

// Deploy rules
console.log('\n🚀 Deploying Firestore and Storage rules...');
try {
  execSync('firebase deploy --only firestore:rules,storage', { stdio: 'inherit' });
  console.log('\n✅ Rules deployed successfully!');
  console.log('\n📝 Next steps:');
  console.log('1. Create an admin user in Firestore');
  console.log('2. Test the login page at /admin/login');
  console.log('3. Verify admin functionality');
} catch (error) {
  console.error('\n❌ Failed to deploy rules. Please check your Firebase configuration.');
  console.error('Make sure you have the correct project selected:');
  console.error('   firebase use ig-thar-village');
}