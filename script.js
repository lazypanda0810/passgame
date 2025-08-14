class PasswordGame {
    constructor() {
        this.password = '';
        this.currentRuleIndex = 0;
        this.satisfiedRules = new Set();
        this.impossibilityLevels = [
            'Beginner', 'Easy', 'Normal', 'Hard', 'Expert', 'Nightmare', 
            'Impossible', 'Absurd', 'Ridiculous', 'Insane', 'Cosmic Horror'
        ];
        
        this.rules = [
            // Level 1 - Basic rules
            {
                id: 'length',
                text: 'Password must be at least 8 characters long',
                check: (pwd) => pwd.length >= 8,
                level: 0
            },
            {
                id: 'uppercase',
                text: 'Password must contain at least one uppercase letter',
                check: (pwd) => /[A-Z]/.test(pwd),
                level: 0
            },
            {
                id: 'lowercase',
                text: 'Password must contain at least one lowercase letter',
                check: (pwd) => /[a-z]/.test(pwd),
                level: 0
            },
            
            // Level 2 - Getting harder
            {
                id: 'number',
                text: 'Password must contain at least one number',
                check: (pwd) => /\d/.test(pwd),
                level: 1
            },
            {
                id: 'special',
                text: 'Password must contain at least one special character (!@#$%^&*)',
                check: (pwd) => /[!@#$%^&*]/.test(pwd),
                level: 1
            },
            {
                id: 'no-common',
                text: 'Password cannot contain common words (password, 123456, qwerty)',
                check: (pwd) => {
                    const common = ['password', '123456', 'qwerty', 'admin', 'login', 'user'];
                    return !common.some(word => pwd.toLowerCase().includes(word));
                },
                level: 1
            },
            
            // Level 3 - Mathematical requirements
            {
                id: 'sum-25',
                text: 'The sum of all numbers in password must equal 25',
                check: (pwd) => {
                    const numbers = pwd.match(/\d/g);
                    if (!numbers) return false;
                    const sum = numbers.reduce((acc, num) => acc + parseInt(num), 0);
                    return sum === 25;
                },
                level: 2
            },
            {
                id: 'prime-length',
                text: 'Password length must be a prime number',
                check: (pwd) => {
                    const len = pwd.length;
                    if (len < 2) return false;
                    for (let i = 2; i <= Math.sqrt(len); i++) {
                        if (len % i === 0) return false;
                    }
                    return true;
                },
                level: 2
            },
            
            // Level 4 - Date and time
            {
                id: 'current-month',
                text: 'Password must include the current month (07 for July)',
                check: (pwd) => {
                    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
                    return pwd.includes(currentMonth);
                },
                level: 3
            },
            {
                id: 'roman-numerals',
                text: 'Password must contain Roman numerals that add up to 100 (C, L, X, V, I)',
                check: (pwd) => {
                    const romanMap = { 'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000 };
                    let total = 0;
                    const romans = pwd.match(/[IVXLCDM]/g);
                    if (!romans) return false;
                    
                    for (let i = 0; i < romans.length; i++) {
                        const current = romanMap[romans[i]];
                        const next = romanMap[romans[i + 1]];
                        if (next && current < next) {
                            total -= current;
                        } else {
                            total += current;
                        }
                    }
                    return total === 100;
                },
                level: 3
            },
            
            // Level 5 - Word games
            {
                id: 'palindrome',
                text: 'Password must contain a palindrome of at least 5 characters',
                check: (pwd) => {
                    for (let i = 0; i < pwd.length - 4; i++) {
                        for (let j = i + 5; j <= pwd.length; j++) {
                            const substr = pwd.substring(i, j);
                            if (substr === substr.split('').reverse().join('')) {
                                return true;
                            }
                        }
                    }
                    return false;
                },
                level: 4
            },
            {
                id: 'country-capital',
                text: 'Password must include a country and its capital (e.g., FranceParis)',
                check: (pwd) => {
                    const pairs = [
                        'FranceParis', 'GermanyBerlin', 'ItalyRome', 'SpainMadrid',
                        'JapanTokyo', 'ChinaBeijing', 'IndiaDelhi', 'BrazilBrasilia'
                    ];
                    return pairs.some(pair => pwd.includes(pair));
                },
                level: 4
            },
            
            // Level 6 - Getting ridiculous
            {
                id: 'chess-notation',
                text: 'Password must contain valid chess notation (e.g., e4, Nf3, O-O)',
                check: (pwd) => {
                    const chessPattern = /[KQRBN]?[a-h]?[1-8]?x?[a-h][1-8](\+|#)?|O-O(-O)?/;
                    return chessPattern.test(pwd);
                },
                level: 5
            },
            {
                id: 'periodic-element',
                text: 'Password must include at least 3 chemical element symbols (He, Li, Be, etc.)',
                check: (pwd) => {
                    const elements = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca'];
                    let count = 0;
                    elements.forEach(el => {
                        if (pwd.includes(el)) count++;
                    });
                    return count >= 3;
                },
                level: 5
            },
            
            // Level 7 - Absolutely insane
            {
                id: 'moon-phase',
                text: 'Password must include the current moon phase emoji 🌙',
                check: (pwd) => pwd.includes('🌙'),
                level: 6
            },
            {
                id: 'fibonacci',
                text: 'Password must contain Fibonacci sequence numbers (1,1,2,3,5,8,13...)',
                check: (pwd) => {
                    const fib = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
                    return fib.some(num => pwd.includes(num.toString()));
                },
                level: 6
            },
            {
                id: 'captcha',
                text: 'Password must include the solution: What is 🐔 + 🥚? (Answer: chicken)',
                check: (pwd) => pwd.toLowerCase().includes('chicken'),
                level: 6
            },
            
            // Level 8 - Contradictory rules
            {
                id: 'no-vowels',
                text: 'Password must not contain any vowels (a, e, i, o, u)',
                check: (pwd) => !/[aeiouAEIOU]/.test(pwd),
                level: 7
            },
            {
                id: 'all-vowels',
                text: 'Password must contain all 5 vowels (a, e, i, o, u)',
                check: (pwd) => {
                    const vowels = ['a', 'e', 'i', 'o', 'u'];
                    return vowels.every(vowel => pwd.toLowerCase().includes(vowel));
                },
                level: 7
            },
            
            // Level 9 - Impossible requirements
            {
                id: 'exactly-16',
                text: 'Password must be exactly 16 characters long',
                check: (pwd) => pwd.length === 16,
                level: 8
            },
            {
                id: 'exactly-32',
                text: 'Password must be exactly 32 characters long',
                check: (pwd) => pwd.length === 32,
                level: 8
            },
            {
                id: 'todays-weather',
                text: 'Password must include today\'s temperature in your city (e.g., 23C)',
                check: (pwd) => /\d+[CF]/.test(pwd),
                level: 8
            },
            
            // Level 10 - Pure madness
            {
                id: 'sponsors',
                text: 'Password must include "This password is sponsored by NordVPN"',
                check: (pwd) => pwd.includes('This password is sponsored by NordVPN'),
                level: 9
            },
            {
                id: 'wordle',
                text: 'Password must contain today\'s Wordle answer (you must guess correctly)',
                check: (pwd) => {
                    const possibleAnswers = ['ABOUT', 'HEART', 'WORLD', 'SOUND', 'GREAT'];
                    return possibleAnswers.some(word => pwd.toUpperCase().includes(word));
                },
                level: 9
            },
            {
                id: 'captcha-math',
                text: 'Solve: If a train leaves at 2:30 PM going 60mph, and another at 3:00 PM going 80mph, when do they meet? Include answer in password.',
                check: (pwd) => pwd.includes('never') || pwd.includes('parallel'),
                level: 9
            },
            
            // Level 11 - The final impossible rule
            {
                id: 'delete-password',
                text: 'Your password is too powerful. Please delete it.',
                check: (pwd) => pwd.length === 0,
                level: 10
            }
        ];
        
        this.init();
    }
    
    init() {
        this.passwordInput = document.getElementById('password');
        this.rulesContainer = document.getElementById('rules-list');
        this.satisfiedCount = document.getElementById('satisfied-count');
        this.totalCount = document.getElementById('total-count');
        this.impossibilityLevel = document.getElementById('impossibility-level');
        this.gameStatus = document.getElementById('game-status');
        this.submitBtn = document.getElementById('submit-btn');
        this.strengthBar = document.getElementById('strengthBar');
        this.easterEgg = document.getElementById('easter-egg');
        this.victoryModal = document.getElementById('victory-modal');
        
        this.passwordInput.addEventListener('input', (e) => {
            this.password = e.target.value;
            this.updateGame();
        });
        
        this.submitBtn.addEventListener('click', () => {
            this.handleSubmit();
        });
        
        this.updateGame();
    }
    
    updateGame() {
        this.checkPassword();
        this.updateDisplay();
        this.updateProgressiveRules();
    }
    
    checkPassword() {
        this.satisfiedRules.clear();
        const activeRules = this.getActiveRules();
        
        activeRules.forEach(rule => {
            if (rule.check(this.password)) {
                this.satisfiedRules.add(rule.id);
            }
        });
    }
    
    getActiveRules() {
        // Progressively add rules based on password length and complexity
        let activeRuleCount = Math.min(
            Math.floor(this.password.length / 2) + 3,
            this.rules.length
        );
        
        // Add bonus rules if user is doing well
        if (this.satisfiedRules.size > activeRuleCount * 0.8) {
            activeRuleCount = Math.min(activeRuleCount + 2, this.rules.length);
        }
        
        return this.rules.slice(0, activeRuleCount);
    }
    
    updateDisplay() {
        const activeRules = this.getActiveRules();
        this.rulesContainer.innerHTML = '';
        
        activeRules.forEach(rule => {
            const ruleDiv = document.createElement('div');
            ruleDiv.className = 'rule';
            
            let icon = '❌';
            let status = 'violated';
            
            if (this.satisfiedRules.has(rule.id)) {
                icon = '✅';
                status = 'satisfied';
            } else if (this.isRuleImpossible(rule)) {
                icon = '💀';
                status = 'impossible';
            } else if (this.password.length === 0) {
                icon = '⏳';
                status = 'pending';
            }
            
            ruleDiv.classList.add(status);
            ruleDiv.innerHTML = `
                <span class="rule-icon">${icon}</span>
                <span class="rule-text">${rule.text}</span>
            `;
            
            this.rulesContainer.appendChild(ruleDiv);
        });
        
        // Update counts
        this.satisfiedCount.textContent = this.satisfiedRules.size;
        this.totalCount.textContent = activeRules.length;
        
        // Update impossibility level
        const maxLevel = Math.max(...activeRules.map(r => r.level));
        this.impossibilityLevel.textContent = this.impossibilityLevels[Math.min(maxLevel, this.impossibilityLevels.length - 1)];
        
        // Update strength bar
        const progress = activeRules.length > 0 ? (this.satisfiedRules.size / activeRules.length) * 100 : 0;
        this.strengthBar.style.width = `${progress}%`;
        
        // Update submit button
        this.submitBtn.disabled = this.satisfiedRules.size !== activeRules.length || activeRules.length === 0;
        
        // Update game status
        this.updateGameStatus(activeRules);
    }
    
    updateGameStatus(activeRules) {
        const satisfiedPercentage = activeRules.length > 0 ? (this.satisfiedRules.size / activeRules.length) * 100 : 0;
        
        if (this.password.length === 0) {
            this.gameStatus.innerHTML = '<p>Start typing to see the rules appear...</p>';
        } else if (satisfiedPercentage === 100) {
            this.gameStatus.innerHTML = '<p>🎉 All current rules satisfied! But wait... there are more rules coming...</p>';
        } else if (satisfiedPercentage >= 80) {
            this.gameStatus.innerHTML = '<p>🔥 You\'re doing great! Just a few more rules to go...</p>';
        } else if (satisfiedPercentage >= 50) {
            this.gameStatus.innerHTML = '<p>⚡ Good progress! Keep going!</p>';
        } else if (satisfiedPercentage >= 20) {
            this.gameStatus.innerHTML = '<p>🤔 This is getting tricky...</p>';
        } else {
            this.gameStatus.innerHTML = '<p>😅 This is harder than it looks, isn\'t it?</p>';
        }
        
        // Check for impossible situations
        if (this.hasContradictoryRules(activeRules)) {
            this.gameStatus.innerHTML = '<p>💀 Wait... some of these rules contradict each other! This might be impossible...</p>';
        }
    }
    
    updateProgressiveRules() {
        // Add easter egg when user has been trying for a while
        if (this.password.length > 50 && !this.easterEgg.style.display !== 'none') {
            this.easterEgg.style.display = 'block';
        }
    }
    
    isRuleImpossible(rule) {
        // Check if this rule contradicts any satisfied rule
        const activeRules = this.getActiveRules();
        return this.hasContradictoryRules(activeRules) && activeRules.includes(rule);
    }
    
    hasContradictoryRules(rules) {
        const ruleIds = rules.map(r => r.id);
        return (ruleIds.includes('no-vowels') && ruleIds.includes('all-vowels')) ||
               (ruleIds.includes('exactly-16') && ruleIds.includes('exactly-32')) ||
               (ruleIds.includes('delete-password') && rules.length > 1);
    }
    
    handleSubmit() {
        const activeRules = this.getActiveRules();
        if (this.satisfiedRules.size === activeRules.length) {
            // Check if this is the final impossible rule
            if (activeRules.some(rule => rule.id === 'delete-password')) {
                this.showVictoryModal();
            } else {
                // Add more rules and continue the torture
                this.addSurpriseRule();
            }
        }
    }
    
    addSurpriseRule() {
        // Add a completely new, absurd rule
        const surpriseRules = [
            {
                id: 'password-length-pi',
                text: 'Password length must be exactly π (3.14159...) characters long',
                check: (pwd) => pwd.length === Math.PI, // Always false!
                level: 10
            },
            {
                id: 'include-user-ip',
                text: 'Password must include your current IP address',
                check: (pwd) => pwd.includes('192.168.1.1'), // Unlikely
                level: 10
            },
            {
                id: 'no-keyboard-letters',
                text: 'Password must not contain any letters that appear on a QWERTY keyboard',
                check: (pwd) => !/[qwertyuiopasdfghjklzxcvbnm]/i.test(pwd),
                level: 10
            }
        ];
        
        const randomRule = surpriseRules[Math.floor(Math.random() * surpriseRules.length)];
        this.rules.push(randomRule);
        this.updateDisplay();
        
        this.gameStatus.innerHTML = '<p>🎪 Surprise! Here\'s another rule just for you!</p>';
    }
    
    showVictoryModal() {
        this.victoryModal.style.display = 'flex';
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.passwordGame = new PasswordGame();
});

// Restart game function
function restartGame() {
    document.getElementById('victory-modal').style.display = 'none';
    document.getElementById('password').value = '';
    document.getElementById('easter-egg').style.display = 'none';
    window.passwordGame = new PasswordGame();
}

// Add some fun interactions
document.addEventListener('keydown', (e) => {
    // Easter egg: Konami code
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    if (!window.konamiSequence) window.konamiSequence = [];
    
    window.konamiSequence.push(e.code);
    if (window.konamiSequence.length > konamiCode.length) {
        window.konamiSequence.shift();
    }
    
    if (window.konamiSequence.join(',') === konamiCode.join(',')) {
        document.body.style.transform = 'rotate(180deg)';
        document.body.style.transition = 'transform 2s ease';
        setTimeout(() => {
            document.body.style.transform = 'rotate(0deg)';
        }, 3000);
    }
});

// Add random glitches for fun
setInterval(() => {
    if (Math.random() < 0.01) { // 1% chance every second
        const glitchMessages = [
            'ERROR: Password too secure, please make it weaker',
            'WARNING: This password might become sentient',
            'NOTICE: Your password is being judged by a committee of cats',
            'ALERT: Password rejected by the International Password Council'
        ];
        
        const gameStatus = document.getElementById('game-status');
        const originalContent = gameStatus.innerHTML;
        gameStatus.innerHTML = `<p style="color: red; animation: shake 0.5s ease-in-out;">${glitchMessages[Math.floor(Math.random() * glitchMessages.length)]}</p>`;
        
        setTimeout(() => {
            gameStatus.innerHTML = originalContent;
        }, 2000);
    }
}, 1000);
