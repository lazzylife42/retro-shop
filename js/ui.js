// ui.js - Gestion de l'interface utilisateur rétro (version simplifiée)

class UI {
    constructor() {
        console.log("Initialisation de l'interface utilisateur...");
        this.moneyElement = document.getElementById('money');
        this.itemNameElement = document.getElementById('item-name');
        this.itemPriceElement = document.getElementById('item-price');
        this.controlsInfo = document.getElementById('controls-info');
        
        this.credits = 1000;
        this.updateCredits(0);
        
        // Éléments pour les messages et notifications
        this.createMessageSystem();
        console.log("Interface utilisateur initialisée.");
    }
    
    createMessageSystem() {
        console.log("Création du système de messages...");
        // Créer un élément pour les messages et notifications rétro
        this.messageContainer = document.createElement('div');
        this.messageContainer.style.position = 'absolute';
        this.messageContainer.style.top = '40%';
        this.messageContainer.style.left = '50%';
        this.messageContainer.style.transform = 'translate(-50%, -50%)';
        this.messageContainer.style.textAlign = 'center';
        this.messageContainer.style.pointerEvents = 'none';
        this.messageContainer.style.zIndex = '20';
        document.getElementById('hud').appendChild(this.messageContainer);
        console.log("Système de messages créé.");
    }
    
    updateCredits(amount) {
        this.credits += amount;
        this.moneyElement.innerText = `CRÉDITS: ${this.credits}`;
        
        // Effet visuel
        if (amount !== 0) {
            this.moneyElement.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.moneyElement.style.transform = 'scale(1)';
            }, 300);
        }
    }
    
    updateItemInfo(item = null) {
        if (item) {
            this.itemNameElement.innerText = item.name || '-';
            this.itemPriceElement.innerText = item.price ? `${item.price} CR` : '-';
        } else {
            this.itemNameElement.innerText = '-';
            this.itemPriceElement.innerText = '-';
        }
    }
    
    updateControlsInfo(state) {
        let controls = '';
        
        switch (state) {
            case 'carousel':
                controls = `
                    <div class="retro-text">UTILISEZ LES FLÈCHES POUR NAVIGUER</div>
                    <div class="retro-text">APPUYEZ SUR ESPACE POUR SÉLECTIONNER</div>
                `;
                break;
            case 'portfolio':
                controls = `
                    <div class="retro-text">UTILISEZ LES FLÈCHES POUR PARCOURIR</div>
                    <div class="retro-text">APPUYEZ SUR ESPACE POUR ACHETER</div>
                    <div class="retro-text">APPUYEZ SUR ÉCHAP POUR RETOURNER</div>
                `;
                break;
            case 'purchase':
                controls = `
                    <div class="retro-text">GAUCHE/DROITE: OUI/NON</div>
                    <div class="retro-text">APPUYEZ SUR ESPACE POUR CONFIRMER</div>
                `;
                break;
            default:
                controls = `
                    <div class="retro-text">UTILISEZ LES FLÈCHES POUR NAVIGUER</div>
                    <div class="retro-text">APPUYEZ SUR ESPACE POUR INTERAGIR</div>
                `;
        }
        
        this.controlsInfo.innerHTML = controls;
    }
    
    showMessage(message, duration = 3000) {
        console.log("Message: " + message);
        // Créer un élément de message rétro
        const messageElement = document.createElement('div');
        messageElement.className = 'retro-text';
        messageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        messageElement.style.color = '#ffffff';
        messageElement.style.padding = '15px';
        messageElement.style.border = '4px solid #fff';
        messageElement.style.marginBottom = '10px';
        messageElement.style.textShadow = '2px 2px 0 #ff00ff';
        messageElement.style.opacity = '0';
        messageElement.style.transition = 'opacity 0.3s';
        
        // Ajouter le texte
        messageElement.innerText = message;
        
        // Ajouter au conteneur
        this.messageContainer.appendChild(messageElement);
        
        // Animation d'entrée
        setTimeout(() => {
            messageElement.style.opacity = '1';
        }, 50);
        
        // Animation de sortie et suppression
        setTimeout(() => {
            messageElement.style.opacity = '0';
            setTimeout(() => {
                if (this.messageContainer.contains(messageElement)) {
                    this.messageContainer.removeChild(messageElement);
                }
            }, 300);
        }, duration);
    }
    
    showNotification(type, text) {
        console.log("Notification: " + text);
        let color;
        switch (type) {
            case 'success':
                color = '#00ff00';
                break;
            case 'error':
                color = '#ff0000';
                break;
            case 'info':
                color = '#00ffff';
                break;
            default:
                color = '#ffffff';
        }
        
        // Créer un élément de notification rétro avec la couleur appropriée
        const notifElement = document.createElement('div');
        notifElement.className = 'retro-text';
        notifElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        notifElement.style.color = color;
        notifElement.style.padding = '20px';
        notifElement.style.border = `4px solid ${color}`;
        notifElement.style.marginBottom = '10px';
        notifElement.style.textShadow = '2px 2px 0 #000000';
        notifElement.style.opacity = '0';
        notifElement.style.transition = 'all 0.3s';
        notifElement.style.transform = 'scale(0.8)';
        
        // Ajouter le texte
        notifElement.innerText = text;
        
        // Ajouter au conteneur
        this.messageContainer.appendChild(notifElement);
        
        // Animation d'entrée
        setTimeout(() => {
            notifElement.style.opacity = '1';
            notifElement.style.transform = 'scale(1)';
        }, 50);
        
        // Animation de sortie et suppression
        setTimeout(() => {
            notifElement.style.opacity = '0';
            notifElement.style.transform = 'scale(0.8)';
            setTimeout(() => {
                if (this.messageContainer.contains(notifElement)) {
                    this.messageContainer.removeChild(notifElement);
                }
            }, 300);
        }, 3000);
    }
    
    confirmPurchase(design) {
        console.log("Demande de confirmation d'achat: " + design.name);
        return new Promise((resolve) => {
            // Créer une boîte de dialogue de confirmation simplifiée
            const confirmBox = document.createElement('div');
            confirmBox.style.position = 'absolute';
            confirmBox.style.top = '50%';
            confirmBox.style.left = '50%';
            confirmBox.style.transform = 'translate(-50%, -50%)';
            confirmBox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            confirmBox.style.border = '4px solid #fff';
            confirmBox.style.padding = '20px';
            confirmBox.style.textAlign = 'center';
            confirmBox.style.zIndex = '30';
            
            const title = document.createElement('div');
            title.className = 'retro-text';
            title.innerText = 'CONFIRMER ACHAT';
            title.style.marginBottom = '20px';
            title.style.fontSize = '24px';
            title.style.textShadow = '2px 2px 0 #ff00ff';
            
            const message = document.createElement('div');
            message.className = 'retro-text';
            message.innerText = `Acheter "${design.name}" pour ${design.price} crédits?`;
            message.style.marginBottom = '20px';
            
            const options = document.createElement('div');
            options.style.display = 'flex';
            options.style.justifyContent = 'space-between';
            
            const yesOption = document.createElement('div');
            yesOption.className = 'retro-text';
            yesOption.innerText = 'OUI';
            yesOption.style.padding = '10px 20px';
            yesOption.style.border = '3px solid #fff';
            yesOption.style.cursor = 'pointer';
            
            const noOption = document.createElement('div');
            noOption.className = 'retro-text';
            noOption.innerText = 'NON';
            noOption.style.padding = '10px 20px';
            noOption.style.border = '3px solid #fff';
            noOption.style.cursor = 'pointer';
            
            // État initial: OUI sélectionné
            yesOption.style.backgroundColor = '#ff00ff';
            noOption.style.backgroundColor = 'transparent';
            let selectedOption = 'yes';
            
            // Ajouter les éléments
            options.appendChild(yesOption);
            options.appendChild(noOption);
            confirmBox.appendChild(title);
            confirmBox.appendChild(message);
            confirmBox.appendChild(options);
            document.getElementById('hud').appendChild(confirmBox);
            
            // Gestionnaire de touches simplifié
            const keyHandler = (e) => {
                if (e.key === 'ArrowLeft') {
                    selectedOption = 'yes';
                    yesOption.style.backgroundColor = '#ff00ff';
                    noOption.style.backgroundColor = 'transparent';
                } else if (e.key === 'ArrowRight') {
                    selectedOption = 'no';
                    yesOption.style.backgroundColor = 'transparent';
                    noOption.style.backgroundColor = '#ff00ff';
                } else if (e.key === ' ' || e.key === 'Enter') {
                    document.removeEventListener('keydown', keyHandler);
                    document.getElementById('hud').removeChild(confirmBox);
                    resolve(selectedOption === 'yes');
                } else if (e.key === 'Escape') {
                    document.removeEventListener('keydown', keyHandler);
                    document.getElementById('hud').removeChild(confirmBox);
                    resolve(false);
                }
            };
            
            document.addEventListener('keydown', keyHandler);
            
            // Gestion du clic
            yesOption.addEventListener('click', () => {
                document.removeEventListener('keydown', keyHandler);
                document.getElementById('hud').removeChild(confirmBox);
                resolve(true);
            });
            
            noOption.addEventListener('click', () => {
                document.removeEventListener('keydown', keyHandler);
                document.getElementById('hud').removeChild(confirmBox);
                resolve(false);
            });
        });
    }
    
    showLoadingScreen(progress) {
        console.log(`Mise à jour de l'écran de chargement: ${progress * 100}%`);
        const loadingElement = document.getElementById('loading');
        const progressBar = loadingElement.querySelector('.progress');
        
        if (loadingElement) {
            loadingElement.style.display = 'flex';
            
            if (progressBar) {
                progressBar.style.width = `${progress * 100}%`;
            }
            
            if (progress >= 1) {
                setTimeout(() => {
                    loadingElement.style.opacity = '0';
                    setTimeout(() => {
                        loadingElement.style.display = 'none';
                        loadingElement.style.opacity = '1';
                    }, 500);
                }, 500);
            }
        }
    }
    
    hideLoadingScreen() {
        console.log("Masquage de l'écran de chargement");
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }
}