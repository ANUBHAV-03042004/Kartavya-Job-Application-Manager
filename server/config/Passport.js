const passport       = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User           = require('../models/User');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

// ── Google ────────────────────────────────────────────────────────
passport.use(new GoogleStrategy(
  {
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  `${BASE_URL}/api/auth/google/callback`,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value?.toLowerCase();
      if (!email) return done(new Error('No email from Google'), null);

      // 1. Find by oauthId first (returning OAuth user)
      let user = await User.findOne({ where: { oauthProvider: 'google', oauthId: profile.id } });

      if (!user) {
        // 2. Look for existing account with the same email
        user = await User.findOne({ where: { email } });

        if (user) {
   
          if (!user.password) {
            user.oauthProvider = 'google';
            user.oauthId       = profile.id;
            await user.save();
          }
          
        } else {
        
          user = await User.create({
            name:          profile.displayName || email.split('@')[0],
            email,
            password:      null,
            oauthProvider: 'google',
            oauthId:       profile.id,
          });
        }
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// ── GitHub ────────────────────────────────────────────────────────
passport.use(new GitHubStrategy(
  {
    clientID:     process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL:  `${BASE_URL}/api/auth/github/callback`,
    scope:        ['user:email'],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value?.toLowerCase();
      const resolvedEmail = email || `github_${profile.id}@noemail.kartavya`;

  
      let user = await User.findOne({ where: { oauthProvider: 'github', oauthId: String(profile.id) } });

      if (!user) {
      
        user = email ? await User.findOne({ where: { email: resolvedEmail } }) : null;

        if (user) {
       
          if (!user.password) {
            user.oauthProvider = 'github';
            user.oauthId       = String(profile.id);
            await user.save();
          }
        
        } else {
        
          user = await User.create({
            name:          profile.displayName || profile.username || 'GitHub User',
            email:         resolvedEmail,
            password:      null,
            oauthProvider: 'github',
            oauthId:       String(profile.id),
          });
        }
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));


passport.serializeUser((user, done)   => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) { done(err); }
});

module.exports = passport;