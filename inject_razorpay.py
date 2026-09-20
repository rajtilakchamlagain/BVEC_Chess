import re

with open('src/pages/ChessPlayerEntry.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add httpsCallable import
if 'httpsCallable' not in content:
    content = content.replace("import { doc, setDoc, getDoc } from 'firebase/firestore';", "import { doc, setDoc, getDoc } from 'firebase/firestore';\nimport { getFunctions, httpsCallable } from 'firebase/functions';")

# Find the Razorpay Integration Logic alert and replace it with real logic
razorpay_logic = """
                        setIsLoading(true);
                        const functions = getFunctions();
                        const createOrder = httpsCallable(functions, 'payments-createOrder');
                        
                        createOrder({ amount: roomData.entryFee, receipt: 'rcpt_' + Date.now() })
                        .then(result => {
                            const options = {
                                key: 'rzp_live_TeQk38h6zZnFHW',
                                amount: result.data.amount,
                                currency: 'INR',
                                name: 'ChessVerse Tournament',
                                description: roomData.name + ' Entry Fee',
                                order_id: result.data.orderId,
                                handler: async function (response) {
                                    // On success, register them to database
                                    await handleRegister();
                                    alert('Payment Successful & Registered!');
                                },
                                theme: { color: '#3399cc' }
                            };
                            const rzp1 = new window.Razorpay(options);
                            rzp1.open();
                            setIsLoading(false);
                        })
                        .catch(err => {
                            console.error(err);
                            alert('Failed to initialize payment.');
                            setIsLoading(false);
                        });
"""

content = re.sub(r"// Razorpay Integration Logic\s*alert\([^)]+\\);", razorpay_logic, content)

with open('src/pages/ChessPlayerEntry.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated ChessPlayerEntry.jsx with real Razorpay popup logic')
