const functions = require('firebase-functions/v1');
const admin = require('firebase-admin');

// Mock email sending function
const sendEmail = async (to, subject, body) => {
    console.log(`[EMAIL MOCK] To: ${to} | Subject: ${subject}`);
    console.log(`Body: ${body}`);
    // In production, integrate Resend, SendGrid, or Nodemailer here
};

// 1. Trigger when a player registers
exports.onPlayerRegistered = functions.firestore
    .document('chess_tournaments/{roomCode}/players/{playerId}')
    .onCreate(async (snap, context) => {
        const player = snap.data();
        if (player.email) {
            await sendEmail(
                player.email,
                'Registration Confirmed - ChessVerse',
                `Congrats ${player.name}, you are registered! We will notify you when rounds begin.`
            );
        }
    });

// 2. Trigger when a round is published
exports.onRoundPublished = functions.firestore
    .document('chess_tournaments/{roomCode}/rounds/{roundId}')
    .onUpdate(async (change, context) => {
        const round = change.after.data();
        if (round.status === 'published' && change.before.data().status !== 'published') {
            
            const db = admin.firestore();
            const playersSnap = await db.collection(`chess_tournaments/${context.params.roomCode}/players`).get();
            const players = {};
            playersSnap.forEach(doc => { players[doc.id] = doc.data(); });

            round.pairings.forEach(async (pairing) => {
                const p1 = players[pairing.player1];
                const p2 = players[pairing.player2];

                if (p1?.email) {
                    await sendEmail(p1.email, `Round ${round.roundNumber} Started!`, `You are playing White against ${pairing.player2Name}.`);
                }
                if (p2?.email) {
                    await sendEmail(p2.email, `Round ${round.roundNumber} Started!`, `You are playing Black against ${pairing.player1Name}.`);
                }
            });
            // Handle eliminated players cheering here...
        }
    });

// 3. Trigger when tournament finishes
exports.onTournamentFinished = functions.firestore
    .document('chess_tournaments/{roomCode}')
    .onUpdate(async (change, context) => {
        const tourney = change.after.data();
        if (tourney.status === 'finished' && change.before.data().status !== 'finished') {
            console.log('[EMAIL MOCK] Sending leaderboard to everyone...');
        }
    });
