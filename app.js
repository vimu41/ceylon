// Enhanced AI Travel Assistant with Voice Interaction
class AITravelAssistant {
    constructor() {
      this.recognition = null;
      this.isListening = false;
      this.initVoiceRecognition();
      this.initChatInterface();
    }
  
    initVoiceRecognition() {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = true;
          this.recognition.interimResults = true;
          this.recognition.lang = 'en-US';
  
          this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';
  
            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalTranscript += transcript;
                this.processVoiceCommand(finalTranscript);
              } else {
                interimTranscript += transcript;
              }
            }
            
            // Update UI with interim results
            this.updateChatInput(interimTranscript);
          };
  
          this.recognition.onerror = (event) => {
            console.error('Voice recognition error', event.error);
            this.toggleVoiceUI(false);
          };
        }
      } catch (e) {
        console.error('Voice recognition not supported', e);
      }
    }
  
    initChatInterface() {
      this.chatContainer = document.createElement('div');
      this.chatContainer.className = 'fixed bottom-6 right-6 w-96 bg-white rounded-xl shadow-2xl z-50 overflow-hidden hidden';
      this.chatContainer.innerHTML = `
        <div class="bg-gradient-to-r from-primary to-secondary p-4 text-white flex justify-between items-center">
          <h3 class="font-bold">Travel Assistant</h3>
          <div class="flex space-x-2">
            <button id="toggle-voice" class="p-2 rounded-full hover:bg-white/20 transition-colors">
              <i class="fas fa-microphone"></i>
            </button>
            <button id="minimize-chat" class="p-2 rounded-full hover:bg-white/20 transition-colors">
              <i class="fas fa-minus"></i>
            </button>
            <button id="close-chat" class="p-2 rounded-full hover:bg-white/20 transition-colors">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div class="h-80 overflow-y-auto p-4 space-y-3" id="chat-messages">
          <div class="flex">
            <div class="bg-primary/10 p-3 rounded-full mr-3">
              <i class="fas fa-robot text-primary"></i>
            </div>
            <div class="bg-gray-100 p-3 rounded-lg max-w-xs">
              <p>Hello! I'm your AI travel assistant. How can I help plan your Sri Lankan adventure today?</p>
            </div>
          </div>
        </div>
        <div class="p-4 border-t border-gray-200 relative">
          <div id="interim-result" class="absolute -top-6 left-4 text-sm text-gray-500 bg-white px-2 py-1 rounded-t border border-b-0 border-gray-200 hidden"></div>
          <textarea id="chat-input" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-transparent resize-none" rows="1" placeholder="Ask me anything..."></textarea>
          <div class="flex justify-between items-center mt-2">
            <button id="send-message" class="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded-lg transition-colors">
              Send
            </button>
            <div class="text-sm text-gray-500">
              <span id="typing-indicator" class="hidden">Assistant is typing...</span>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(this.chatContainer);
  
      // Event listeners
      document.getElementById('toggle-voice').addEventListener('click', () => this.toggleVoice());
      document.getElementById('minimize-chat').addEventListener('click', () => this.toggleChat());
      document.getElementById('close-chat').addEventListener('click', () => this.closeChat());
      document.getElementById('send-message').addEventListener('click', () => this.sendMessage());
      document.getElementById('chat-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
  
      // Toggle button in navbar
      const aiButton = document.querySelector('[data-ai-assistant]');
      if (aiButton) {
        aiButton.addEventListener('click', () => this.toggleChat());
      }
    }
  
    toggleVoice() {
      if (!this.recognition) {
        this.addMessage('system', 'Voice commands are not supported in your browser');
        return;
      }
  
      this.isListening = !this.isListening;
      const voiceBtn = document.getElementById('toggle-voice');
      
      if (this.isListening) {
        this.recognition.start();
        voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
        voiceBtn.classList.add('bg-red-500', 'text-white');
        voiceBtn.classList.remove('hover:bg-white/20');
      } else {
        this.recognition.stop();
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceBtn.classList.remove('bg-red-500', 'text-white');
        voiceBtn.classList.add('hover:bg-white/20');
        document.getElementById('interim-result').classList.add('hidden');
      }
    }
  
    toggleVoiceUI(listening) {
      const voiceBtn = document.getElementById('toggle-voice');
      if (listening) {
        voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
        voiceBtn.classList.add('bg-red-500', 'text-white');
      } else {
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceBtn.classList.remove('bg-red-500', 'text-white');
        document.getElementById('interim-result').classList.add('hidden');
      }
    }
  
    updateChatInput(text) {
      const interimEl = document.getElementById('interim-result');
      interimEl.textContent = text;
      interimEl.classList.remove('hidden');
    }
  
    toggleChat() {
      this.chatContainer.classList.toggle('hidden');
      this.chatContainer.classList.toggle('flex');
      this.chatContainer.classList.toggle('flex-col');
    }
  
    closeChat() {
      this.chatContainer.classList.add('hidden');
      if (this.isListening) {
        this.toggleVoice();
      }
    }
  
    sendMessage() {
      const input = document.getElementById('chat-input');
      const message = input.value.trim();
      if (message) {
        this.addMessage('user', message);
        input.value = '';
        this.processUserMessage(message);
      }
    }
  
    addMessage(sender, text) {
      const messagesContainer = document.getElementById('chat-messages');
      const messageDiv = document.createElement('div');
      messageDiv.className = `flex ${sender === 'user' ? 'justify-end' : ''}`;
      
      messageDiv.innerHTML = `
        <div class="${sender === 'user' ? 'bg-primary text-white' : 'bg-gray-100'} p-3 rounded-lg max-w-xs">
          <p>${text}</p>
        </div>
        ${sender === 'ai' ? 
          '<div class="bg-primary/10 p-3 rounded-full mr-3"><i class="fas fa-robot text-primary"></i></div>' : 
          ''}
      `;
      
      messagesContainer.appendChild(messageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  
    showTypingIndicator() {
      document.getElementById('typing-indicator').classList.remove('hidden');
    }
  
    hideTypingIndicator() {
      document.getElementById('typing-indicator').classList.add('hidden');
    }
  
    async processUserMessage(message) {
      this.showTypingIndicator();
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, this would call your AI service
        const response = await this.generateAIResponse(message);
        this.addMessage('ai', response);
        
        // Special commands can trigger actions
        if (message.toLowerCase().includes('show me hotels')) {
          this.showHotelRecommendations();
        } else if (message.toLowerCase().includes('3d view')) {
          this.show3DDestination();
        }
      } catch (error) {
        this.addMessage('ai', "I'm having trouble connecting to the service. Please try again later.");
        console.error('AI processing error:', error);
      } finally {
        this.hideTypingIndicator();
      }
    }
  
    processVoiceCommand(command) {
      console.log('Processing voice command:', command);
      this.addMessage('user', command);
      this.processUserMessage(command);
      document.getElementById('interim-result').classList.add('hidden');
    }
  
    async generateAIResponse(message) {
      // This would be replaced with actual AI API calls
      const responses = {
        'hello': 'Hello! How can I assist with your Sri Lanka travel plans today?',
        'best beaches': 'The top beaches in Sri Lanka are Unawatuna, Mirissa, and Arugam Bay. Would you like details on any specific one?',
        'cultural sites': 'Must-visit cultural sites include Sigiriya Rock, Temple of the Tooth in Kandy, and the ancient cities of Anuradhapura and Polonnaruwa.',
        'weather': 'The weather varies by region. Coastal areas are warm year-round while hill country is cooler. When are you planning to visit?',
        'default': 'I can help with recommendations for beaches, cultural sites, wildlife safaris, and more. What specifically would you like to know?'
      };
  
      const lowerMsg = message.toLowerCase();
      for (const [key, response] of Object.entries(responses)) {
        if (lowerMsg.includes(key)) {
          return response;
        }
      }
      return responses.default;
    }
  
    showHotelRecommendations() {
      // This would show hotel recommendations in UI
      this.addMessage('ai', "Here are some highly-rated hotels matching your preferences:");
      
      const hotels = [
        { name: "Cape Weligama", rating: 4.8, price: "$$$", type: "Luxury Beach Resort" },
        { name: "Jetwing Vil Uyana", rating: 4.7, price: "$$$", type: "Eco Luxury" },
        { name: "Cinnamon Bentota", rating: 4.5, price: "$$", type: "Beach Resort" }
      ];
      
      const hotelsHTML = hotels.map(hotel => `
        <div class="border border-gray-200 rounded-lg p-3 mb-2">
          <h4 class="font-bold">${hotel.name}</h4>
          <div class="flex items-center text-sm text-yellow-500 mb-1">
            ${'★'.repeat(Math.floor(hotel.rating))}${'☆'.repeat(5-Math.floor(hotel.rating))}
            <span class="text-gray-600 ml-2">${hotel.rating}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span>${hotel.type}</span>
            <span class="font-medium">${hotel.price}</span>
          </div>
        </div>
      `).join('');
      
      this.addMessage('ai', hotelsHTML);
    }
  
    show3DDestination() {
      // This would trigger 3D model viewing
      this.addMessage('ai', "Showing you a 3D preview of Sigiriya Rock Fortress...");
      
      // In a real app, this would initialize the 3D viewer
      setTimeout(() => {
        this.addMessage('system', '3D viewer activated. Rotate and zoom to explore.');
      }, 1000);
    }
  }
  
  // Augmented Reality Viewer for Destinations
  class ARViewer {
    constructor() {
      this.isARSupported = false;
      this.checkARSupport();
      this.initUI();
    }
  
    async checkARSupport() {
      if (navigator.xr) {
        this.isARSupported = await navigator.xr.isSessionSupported('immersive-ar');
      }
    }
  
    initUI() {
      this.arButton = document.createElement('button');
      this.arButton.className = 'fixed bottom-24 right-6 bg-primary text-white p-3 rounded-full shadow-lg z-40 hidden';
      this.arButton.innerHTML = '<i class="fas fa-cube mr-2"></i>View in AR';
      this.arButton.addEventListener('click', () => this.launchARViewer());
      document.body.appendChild(this.arButton);
    }
  
    showButton() {
      if (this.isARSupported) {
        this.arButton.classList.remove('hidden');
      }
    }
  
    async launchARViewer() {
      try {
        // This would launch actual AR viewer
        this.arButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Launching AR...';
        
        // Simulate AR loading
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // In a real app, this would initialize WebXR session
        console.log('AR viewer launched');
        this.arButton.innerHTML = '<i class="fas fa-cube mr-2"></i>View in AR';
        
        // Show message in chat if open
        const chat = document.getElementById('chat-messages');
        if (chat) {
          const messageDiv = document.createElement('div');
          messageDiv.className = 'flex justify-center';
          messageDiv.innerHTML = `
            <div class="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm">
              <p>Point your camera at a flat surface to place the 3D model</p>
            </div>
          `;
          chat.appendChild(messageDiv);
          chat.scrollTop = chat.scrollHeight;
        }
      } catch (error) {
        console.error('AR error:', error);
        this.arButton.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i>AR Failed';
      }
    }
  }
  
  // Real-time Collaboration Features
  class TripCollaborator {
    constructor() {
      this.socket = null;
      this.initSocketConnection();
      this.initUI();
    }
  
    initSocketConnection() {
      // This would connect to your real-time backend
      console.log('Initializing real-time collaboration');
      // this.socket = io('https://your-socket-server.com');
      
      // Simulate connection
      setTimeout(() => {
        this.connectionEstablished();
      }, 1000);
    }
  
    connectionEstablished() {
      const statusIndicator = document.getElementById('collab-status');
      if (statusIndicator) {
        statusIndicator.innerHTML = '<i class="fas fa-circle text-green-500 mr-2"></i>Connected';
      }
    }
  
    initUI() {
      this.collabContainer = document.createElement('div');
      this.collabContainer.className = 'fixed bottom-24 left-6 bg-white rounded-lg shadow-lg p-4 z-40 hidden';
      this.collabContainer.innerHTML = `
        <h4 class="font-bold mb-2 flex items-center">
          <i class="fas fa-users mr-2"></i>
          <span>Collaborators</span>
          <span id="collab-status" class="ml-auto text-sm font-normal">
            <i class="fas fa-circle text-gray-500 mr-2"></i>Connecting...
          </span>
        </h4>
        <div class="space-y-2 my-3" id="collab-users">
          <div class="flex items-center">
            <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>You</span>
          </div>
        </div>
        <input type="text" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-2" placeholder="Invite by email...">
        <button class="w-full bg-primary hover:bg-opacity-90 text-white py-2 rounded-lg text-sm">
          Send Invitation
        </button>
      `;
      document.body.appendChild(this.collabContainer);
    }
  
    toggleCollaboratorUI() {
      this.collabContainer.classList.toggle('hidden');
    }
  
    addCollaborator(user) {
      const usersContainer = document.getElementById('collab-users');
      const userDiv = document.createElement('div');
      userDiv.className = 'flex items-center';
      userDiv.innerHTML = `
        <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
        <span>${user.name}</span>
        <span class="ml-auto text-xs text-gray-500">${user.role}</span>
      `;
      usersContainer.appendChild(userDiv);
    }
  }
  
  // Enhanced Main Application with All Features
  class SriLankaTravelAppEnhanced extends SriLankaTravelApp {
    constructor() {
      super();
      this.aiAssistant = new AITravelAssistant();
      this.arViewer = new ARViewer();
      this.collaborator = new TripCollaborator();
      this.initEnhancedFeatures();
    }
  
    initEnhancedFeatures() {
      this.initARTriggers();
      this.initCollaborationTriggers();
      this.initPersonalization();
      this.initOfflineCapabilities();
    }
  
    initARTriggers() {
      document.querySelectorAll('[data-ar-model]').forEach(item => {
        item.addEventListener('click', () => {
          const model = item.getAttribute('data-ar-model');
          this.arViewer.showButton();
          
          // Show info in AI chat
          this.aiAssistant.addMessage('system', `AR view available for ${model}. Tap the AR button to view in your space.`);
          if (this.aiAssistant.chatContainer.classList.contains('hidden')) {
            this.aiAssistant.toggleChat();
          }
        });
      });
    }
  
    initCollaborationTriggers() {
      const collabBtn = document.querySelector('[data-collab-toggle]');
      if (collabBtn) {
        collabBtn.addEventListener('click', () => {
          this.collaborator.toggleCollaboratorUI();
        });
      }
    }
  
    initPersonalization() {
      // Load user preferences from localStorage
      const userPrefs = JSON.parse(localStorage.getItem('travelPrefs')) || {};
      
      // Apply theme if set
      if (userPrefs.theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
      
      // Set name if available
      if (userPrefs.name) {
        const nameElements = document.querySelectorAll('[data-user-name]');
        nameElements.forEach(el => {
          el.textContent = userPrefs.name;
        });
      }
    }
  
    initOfflineCapabilities() {
      // Check if offline and show cached content
      window.addEventListener('offline', () => {
        this.showOfflineUI();
      });
  
      if (!navigator.onLine) {
        this.showOfflineUI();
      }
    }
  
    showOfflineUI() {
      const offlineBanner = document.createElement('div');
      offlineBanner.className = 'fixed bottom-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 z-50';
      offlineBanner.innerHTML = `
        <i class="fas fa-wifi-slash mr-2"></i>
        You're currently offline. Some features may be limited.
      `;
      document.body.appendChild(offlineBanner);
    }
  }
  
  // Initialize Enhanced App
  document.addEventListener('DOMContentLoaded', () => {
    const app = new SriLankaTravelAppEnhanced();
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('ServiceWorker registration successful');
      }).catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
    }
    
    // Add to homescreen prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      const installPrompt = document.createElement('div');
      installPrompt.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-xl z-50 flex items-center';
      installPrompt.innerHTML = `
        <i class="fas fa-mobile-alt text-primary mr-3 text-xl"></i>
        <div>
          <p class="font-medium">Install Sri Lanka Travel Planner</p>
          <p class="text-sm text-gray-600">Add to your home screen for full experience</p>
        </div>
        <button id="install-btn" class="ml-4 bg-primary text-white px-4 py-1 rounded-lg">Install</button>
        <button id="dismiss-btn" class="ml-2 text-gray-500 hover:text-gray-700">
          <i class="fas fa-times"></i>
        </button>
      `;
      document.body.appendChild(installPrompt);
      
      document.getElementById('install-btn').addEventListener('click', () => {
        e.prompt();
        installPrompt.remove();
      });
      
      document.getElementById('dismiss-btn').addEventListener('click', () => {
        installPrompt.remove();
      });
    });
  });
  const express = require('express');
const app = express();

app.use(express.json()); // 📌 Required to parse JSON in requests

const destinationRoutes = require('./routes/destinations');
app.use('/api/destinations', destinationRoutes);
