export const generateCodeVerifier = () => {
    const array = new Uint32Array(56 / 2);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
};

export const generateCodeChallenge = async (verifier) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, new Uint8Array(hash)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

export const startLichessAuth = async (roomCode) => {
    // We use the app's domain as the client ID for Lichess
    const clientId = 'bvecchess.vercel.app'; 
    const redirectUri = `${window.location.origin}/chess-entry`; 
    
    const verifier = generateCodeVerifier();
    localStorage.setItem('lichess_code_verifier', verifier);
    localStorage.setItem('lichess_room_code', roomCode); // Remember which tournament they were joining
    
    const challenge = await generateCodeChallenge(verifier);
    
    const authUrl = `https://lichess.org/oauth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&code_challenge_method=S256&code_challenge=${challenge}&scope=email:read`;
    
    window.location.href = authUrl;
};

export const finishLichessAuth = async (code) => {
    const clientId = 'bvecchess.vercel.app';
    const redirectUri = `${window.location.origin}/chess-entry`;
    const verifier = localStorage.getItem('lichess_code_verifier');
    
    if (!verifier) return null;
    
    try {
        const response = await fetch('https://lichess.org/api/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                grant_type: 'authorization_code',
                code,
                code_verifier: verifier,
                redirect_uri: redirectUri,
                client_id: clientId
            })
        });
        
        const data = await response.json();
        
        if (data.access_token) {
            // Fetch their Lichess profile
            const userRes = await fetch('https://lichess.org/api/account', {
                headers: { 'Authorization': `Bearer ${data.access_token}` }
            });
            const userData = await userRes.json();
            return userData;
        }
    } catch (err) {
        console.error("Lichess Auth Error:", err);
    }
    
    return null;
};
