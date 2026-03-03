// // config/passport.js
// const passport       = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const GitHubStrategy = require('passport-github2').Strategy;
// const User           = require('../models/User');

// const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

// // ── Google ────────────────────────────────────────────────────────
// passport.use(new GoogleStrategy(
//   {
//     clientID:     process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL:  `${BASE_URL}/api/auth/google/callback`,
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     try {
//       const email = profile.emails?.[0]?.value?.toLowerCase();
//       if (!email) return done(new Error('No email from Google'), null);

//       // Find by oauthId first, then by email (in case they signed up normally before)
//       let user = await User.findOne({ where: { oauthProvider: 'google', oauthId: profile.id } });

//       if (!user) {
//         user = await User.findOne({ where: { email } });
//         if (user) {
//           // Link Google to existing email account
//           user.oauthProvider = 'google';
//           user.oauthId       = profile.id;
//           await user.save();
//         } else {
//           // Create brand-new user
//           user = await User.create({
//             name:          profile.displayName || email.split('@')[0],
//             email,
//             password:      null,
//             oauthProvider: 'google',
//             oauthId:       profile.id,
//           });
//         }
//       }

//       return done(null, user);
//     } catch (err) {
//       return done(err, null);
//     }
//   }
// ));

// // ── GitHub ────────────────────────────────────────────────────────
// passport.use(new GitHubStrategy(
//   {
//     clientID:     process.env.GITHUB_CLIENT_ID,
//     clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     callbackURL:  `${BASE_URL}/api/auth/github/callback`,
//     scope:        ['user:email'],
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     try {
//       const email = profile.emails?.[0]?.value?.toLowerCase();
//       // GitHub can have no public email — fall back to a placeholder
//       const resolvedEmail = email || `github_${profile.id}@noemail.kartavya`;

//       let user = await User.findOne({ where: { oauthProvider: 'github', oauthId: String(profile.id) } });

//       if (!user) {
//         user = email ? await User.findOne({ where: { email: resolvedEmail } }) : null;
//         if (user) {
//           user.oauthProvider = 'github';
//           user.oauthId       = String(profile.id);
//           await user.save();
//         } else {
//           user = await User.create({
//             name:          profile.displayName || profile.username || 'GitHub User',
//             email:         resolvedEmail,
//             password:      null,
//             oauthProvider: 'github',
//             oauthId:       String(profile.id),
//           });
//         }
//       }

//       return done(null, user);
//     } catch (err) {
//       return done(err, null);
//     }
//   }
// ));

// // Passport session stubs (not really used — we use JWT, but Passport needs these)
// passport.serializeUser((user, done)   => done(null, user.id));
// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findByPk(id);
//     done(null, user);
//   } catch (err) { done(err); }
// });

// module.exports = passport;







// config/Passport.js
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
          // ── KEY FIX ───────────────────────────────────────────────
          // Only link Google if this account has NO local password.
          // If the user registered with email + password, we must NOT
          // overwrite oauthProvider — doing so would make the frontend
          // treat them as an OAuth user and hide the password/security
          // question sections in Settings.
          // Just sign them in as their existing email account unchanged.
          // ─────────────────────────────────────────────────────────
          if (!user.password) {
            user.oauthProvider = 'google';
            user.oauthId       = profile.id;
            await user.save();
          }
          // else: email+password account — leave it completely untouched
        } else {
          // 3. No matching account — create a brand-new OAuth user
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

      // 1. Find by oauthId first
      let user = await User.findOne({ where: { oauthProvider: 'github', oauthId: String(profile.id) } });

      if (!user) {
        // 2. Look for existing account with same email
        user = email ? await User.findOne({ where: { email: resolvedEmail } }) : null;

        if (user) {
          // ── KEY FIX ───────────────────────────────────────────────
          // Same guard as Google: only link GitHub if NO local password.
          // Email+password accounts stay untouched.
          // ─────────────────────────────────────────────────────────
          if (!user.password) {
            user.oauthProvider = 'github';
            user.oauthId       = String(profile.id);
            await user.save();
          }
          // else: leave email+password account completely untouched
        } else {
          // 3. Create new OAuth-only user
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

// Passport session stubs (not used — JWT after OAuth callback)
passport.serializeUser((user, done)   => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) { done(err); }
});

module.exports = passport;