// Import Three.js components dynamically
async function initThreeJS() {
    const { OrbitControls } = await import('https://unpkg.com/three@0.132.2/examples/jsm/controls/OrbitControls.js');
    const { GLTFLoader } = await import('https://unpkg.com/three@0.132.2/examples/jsm/loaders/GLTFLoader.js');
    
    return { OrbitControls, GLTFLoader };
  }
  
  // Main Application Class
  class SriLankaTravelApp {
    constructor() {
      this.initSmoothScroll();
      this.initMobileMenu();
      this.initFormValidation();
      this.initModals();
      this.initImageSliders();
      this.initParallaxEffects();
      this.init3DModels();
      this.initAIComponents();
      this.initInteractiveMap();
      this.initP5Sketch();
      this.initServiceWorker();
      this.initLazyLoading();
      this.initPageTransitions();
      this.initMicroInteractions();
    }
  
    // Enhanced Smooth Scroll with offset for fixed header
    initSmoothScroll() {
      const headerHeight = document.querySelector('header')?.offsetHeight || 80;
      
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = anchor.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
            
            // Update URL without jumping
            history.pushState(null, null, targetId);
          }
        });
      });
    }
  
    // Advanced Mobile Menu with Animation
    initMobileMenu() {
      const menuBtn = document.querySelector('#menu-btn');
      const menu = document.querySelector('#mobile-menu');
      const menuLinks = document.querySelectorAll('#mobile-menu a');
      
      if (menuBtn && menu) {
        menuBtn.addEventListener('click', () => {
          menu.classList.toggle('translate-x-full');
          menu.classList.toggle('opacity-0');
          menuBtn.querySelector('svg').classList.toggle('hidden');
          menuBtn.querySelector('svg').nextElementSibling.classList.toggle('hidden');
          
          // Toggle body scroll
          document.body.classList.toggle('overflow-hidden');
        });
        
        // Close menu when clicking links
        menuLinks.forEach(link => {
          link.addEventListener('click', () => {
            menu.classList.add('translate-x-full', 'opacity-0');
            document.body.classList.remove('overflow-hidden');
            menuBtn.querySelector('svg').classList.toggle('hidden');
            menuBtn.querySelector('svg').nextElementSibling.classList.toggle('hidden');
          });
        });
      }
    }
  
    // Comprehensive Form Validation with UI Feedback
    initFormValidation() {
      const forms = document.querySelectorAll('form');
      
      forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          let isValid = true;
          const inputs = form.querySelectorAll('input, textarea, select');
          const submitBtn = form.querySelector('button[type="submit"]');
          const originalBtnText = submitBtn.innerHTML;
          
          // Validate each field
          inputs.forEach(input => {
            const errorElement = document.createElement('p');
            errorElement.className = 'mt-1 text-sm text-red-500';
            
            // Remove existing errors
            const existingError = input.nextElementSibling;
            if (existingError && existingError.classList.contains('error-message')) {
              existingError.remove();
            }
            
            input.classList.remove('border-red-500', 'ring-red-200');
            input.classList.add('border-gray-300', 'focus:ring-primary');
            
            // Required validation
            if (input.required && !input.value.trim()) {
              errorElement.textContent = 'This field is required';
              input.insertAdjacentElement('afterend', errorElement);
              input.classList.add('border-red-500', 'focus:ring-red-200');
              input.classList.remove('border-gray-300', 'focus:ring-primary');
              isValid = false;
            }
            
            // Email validation
            if (input.type === 'email' && input.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
              errorElement.textContent = 'Please enter a valid email address';
              input.insertAdjacentElement('afterend', errorElement);
              input.classList.add('border-red-500', 'focus:ring-red-200');
              input.classList.remove('border-gray-300', 'focus:ring-primary');
              isValid = false;
            }
          });
          
          if (isValid) {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            `;
            
            try {
              // Simulate API call
              await new Promise(resolve => setTimeout(resolve, 1500));
              
              // Show success message
              const successElement = document.createElement('div');
              successElement.className = 'mt-4 p-4 bg-green-50 text-green-700 rounded-lg';
              successElement.innerHTML = `
                <div class="flex items-center">
                  <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Thank you! Your message has been sent successfully.
                </div>
              `;
              
              form.reset();
              form.insertAdjacentElement('beforeend', successElement);
              
              // Remove success message after 5s
              setTimeout(() => successElement.remove(), 5000);
            } catch (error) {
              console.error('Form submission error:', error);
              alert('There was an error submitting your form. Please try again.');
            } finally {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalBtnText;
            }
          }
        });
      });
    }
  
    // Modal/Popup System with Animation
    initModals() {
      document.querySelectorAll('[data-modal-toggle]').forEach(button => {
        const modalId = button.getAttribute('data-modal-toggle');
        const modal = document.getElementById(modalId);
        const closeButtons = modal?.querySelectorAll('[data-modal-hide]');
        
        if (modal) {
          button.addEventListener('click', () => {
            modal.classList.remove('hidden', 'opacity-0');
            modal.classList.add('flex');
            setTimeout(() => modal.classList.remove('opacity-0'), 10);
            document.body.classList.add('overflow-hidden');
          });
          
          closeButtons?.forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
              modal.classList.add('opacity-0');
              setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                document.body.classList.remove('overflow-hidden');
              }, 300);
            });
          });
          
          // Close when clicking outside
          modal.addEventListener('click', (e) => {
            if (e.target === modal) {
              modal.classList.add('opacity-0');
              setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                document.body.classList.remove('overflow-hidden');
              }, 300);
            }
          });
        }
      });
    }
  
    // Interactive Image Sliders with Thumbnails
    initImageSliders() {
      document.querySelectorAll('.image-slider').forEach(slider => {
        const slides = slider.querySelectorAll('.slide');
        const thumbnails = slider.querySelectorAll('.thumbnail');
        const prevBtn = slider.querySelector('.prev-btn');
        const nextBtn = slider.querySelector('.next-btn');
        let currentIndex = 0;
        
        function showSlide(index) {
          slides.forEach((slide, i) => {
            slide.classList.toggle('hidden', i !== index);
            slide.classList.toggle('opacity-0', i !== index);
            slide.classList.toggle('flex', i === index);
          });
          
          thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('border-primary', i === index);
            thumb.classList.toggle('border-transparent', i !== index);
            thumb.classList.toggle('opacity-100', i === index);
            thumb.classList.toggle('opacity-70', i !== index);
          });
          
          currentIndex = index;
        }
        
        thumbnails.forEach((thumb, index) => {
          thumb.addEventListener('click', () => showSlide(index));
        });
        
        prevBtn?.addEventListener('click', () => {
          showSlide((currentIndex - 1 + slides.length) % slides.length);
        });
        
        nextBtn?.addEventListener('click', () => {
          showSlide((currentIndex + 1) % slides.length);
        });
        
        // Auto-rotate for hero sliders
        if (slider.classList.contains('auto-rotate')) {
          setInterval(() => {
            showSlide((currentIndex + 1) % slides.length);
          }, 5000);
        }
        
        // Initialize first slide
        showSlide(0);
      });
    }
  
    // Parallax Effects for Depth
    initParallaxEffects() {
      const parallaxElements = document.querySelectorAll('[data-parallax]');
      
      if (parallaxElements.length > 0) {
        window.addEventListener('scroll', () => {
          const scrollPosition = window.pageYOffset;
          
          parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax-speed')) || 0.3;
            const offset = scrollPosition * speed;
            element.style.transform = `translateY(${offset}px)`;
          });
        });
      }
    }
  
    // 3D Model Loader with Interactive Controls
    async init3DModels() {
      const modelContainers = document.querySelectorAll('.model-container');
      
      if (modelContainers.length > 0) {
        try {
          const { OrbitControls, GLTFLoader } = await initThreeJS();
          
          modelContainers.forEach(container => {
            const modelPath = container.getAttribute('data-model');
            const width = container.clientWidth;
            const height = container.clientHeight;
            
            // Scene setup
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0xf3f4f6);
            
            const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            camera.position.z = 5;
            
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(width, height);
            renderer.setPixelRatio(window.devicePixelRatio);
            container.innerHTML = '';
            container.appendChild(renderer.domElement);
            
            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(1, 1, 1);
            scene.add(directionalLight);
            
            // Controls
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.screenSpacePanning = false;
            controls.maxPolarAngle = Math.PI;
            controls.minPolarAngle = 0;
            controls.enableZoom = true;
            controls.enablePan = true;
            controls.enableRotate = true;
            
            // Load model
            const loader = new GLTFLoader();
            loader.load(
              modelPath,
              (gltf) => {
                scene.add(gltf.scene);
                
                // Auto-rotate
                if (container.classList.contains('auto-rotate')) {
                  gltf.scene.rotation.y = 0;
                  const animate = () => {
                    requestAnimationFrame(animate);
                    gltf.scene.rotation.y += 0.005;
                    controls.update();
                    renderer.render(scene, camera);
                  };
                  animate();
                } else {
                  const animate = () => {
                    requestAnimationFrame(animate);
                    controls.update();
                    renderer.render(scene, camera);
                  };
                  animate();
                }
              },
              undefined,
              (error) => {
                console.error('Error loading model:', error);
                container.innerHTML = '<p class="text-gray-500">3D model failed to load</p>';
              }
            );
            
            // Handle resize
            window.addEventListener('resize', () => {
              camera.aspect = container.clientWidth / container.clientHeight;
              camera.updateProjectionMatrix();
              renderer.setSize(container.clientWidth, container.clientHeight);
            });
          });
        } catch (error) {
          console.error('Error initializing 3D models:', error);
        }
      }
    }
  
    // AI Suggestion System (Mock for now)
    initAIComponents() {
      const aiButtons = document.querySelectorAll('[data-ai-trigger]');
      
      aiButtons.forEach(button => {
        button.addEventListener('click', async () => {
          const loadingIndicator = button.querySelector('.ai-loading') || document.createElement('span');
          loadingIndicator.className = 'ai-loading inline-flex ml-2';
          loadingIndicator.innerHTML = `
            <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          `;
          
          if (!button.querySelector('.ai-loading')) {
            button.appendChild(loadingIndicator);
          }
          
          button.disabled = true;
          
          // Simulate AI processing
          try {
            const response = await this.mockAISuggestion();
            this.showAIResponse(response);
          } catch (error) {
            console.error('AI Error:', error);
            alert('AI service is currently unavailable. Please try again later.');
          } finally {
            button.disabled = false;
            loadingIndicator.remove();
          }
        });
      });
    }
  
    // Mock AI Suggestion (would connect to real API)
    async mockAISuggestion() {
      return new Promise(resolve => {
        setTimeout(() => {
          const responses = [
            "Based on your interests, I recommend visiting Sigiriya Rock Fortress and the ancient city of Polonnaruwa for a great cultural experience.",
            "For beach lovers, the golden shores of Unawatuna and the surfing spots in Arugam Bay would be perfect during your travel dates.",
            "Consider adding Yala National Park to your itinerary for wildlife spotting - leopards are often seen in the early morning!"
          ];
          resolve(responses[Math.floor(Math.random() * responses.length)]);
        }, 1500);
      });
    }
  
    // Display AI Response in UI
    showAIResponse(message) {
      let aiModal = document.getElementById('ai-response-modal');
      
      if (!aiModal) {
        aiModal = document.createElement('div');
        aiModal.id = 'ai-response-modal';
        aiModal.className = 'fixed bottom-6 right-6 max-w-md bg-white rounded-xl shadow-2xl z-50 overflow-hidden transform transition-all duration-300 translate-y-10 opacity-0';
        aiModal.innerHTML = `
          <div class="p-4 bg-primary text-white flex justify-between items-center">
            <h3 class="font-bold">AI Travel Suggestion</h3>
            <button id="close-ai-modal" class="text-white hover:text-gray-200">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="p-4 text-gray-700">
            <div class="flex items-start mb-3">
              <div class="flex-shrink-0 bg-primary/10 p-2 rounded-full mr-3">
                <svg class="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <p class="ai-message-content"></p>
            </div>
            <button class="text-sm text-primary font-medium hover:underline">Add to my itinerary</button>
          </div>
        `;
        document.body.appendChild(aiModal);
        
        document.getElementById('close-ai-modal').addEventListener('click', () => {
          aiModal.classList.add('translate-y-10', 'opacity-0');
          setTimeout(() => aiModal.remove(), 300);
        });
      }
      
      aiModal.querySelector('.ai-message-content').textContent = message;
      aiModal.classList.remove('translate-y-10', 'opacity-0');
      
      // Auto-hide after 10 seconds
      setTimeout(() => {
        aiModal.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => aiModal.remove(), 300);
      }, 10000);
    }
  
    // Interactive Map with Leaflet
    initInteractiveMap() {
      const mapContainer = document.getElementById('interactive-map');
      
      if (mapContainer) {
        const map = L.map(mapContainer).setView([7.8731, 80.7718], 7); // Center on Sri Lanka
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Add destination markers
        const destinations = [
          {
            name: "Sigiriya Rock Fortress",
            position: [7.9570, 80.7603],
            type: "cultural",
            icon: "landmark"
          },
          {
            name: "Unawatuna Beach",
            position: [6.0167, 80.2500],
            type: "beach",
            icon: "umbrella-beach"
          },
          // More destinations would be added
        ];
        
        destinations.forEach(dest => {
          const marker = L.marker(dest.position).addTo(map);
          marker.bindPopup(`
            <div class="map-popup">
              <h4 class="font-bold text-lg">${dest.name}</h4>
              <div class="flex items-center text-sm text-gray-600 my-2">
                <i class="fas fa-${dest.icon} mr-2"></i>
                ${dest.type.charAt(0).toUpperCase() + dest.type.slice(1)}
              </div>
              <div class="flex space-x-2 mt-3">
                <button class="text-xs bg-primary text-white px-2 py-1 rounded hover:bg-primary-dark transition-colors">
                  View Details
                </button>
                <button class="text-xs border border-primary text-primary px-2 py-1 rounded hover:bg-primary/10 transition-colors">
                  Add to Trip
                </button>
              </div>
            </div>
          `);
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
          map.invalidateSize();
        });
      }
    }
  
    // Creative p5.js Sketch for Hero Section
    initP5Sketch() {
      const heroCanvas = document.getElementById('hero-canvas');
      
      if (heroCanvas) {
        new p5((p) => {
          let particles = [];
          const colors = [
            p.color(0, 91, 78),   // Primary green
            p.color(255, 122, 69), // Secondary orange
            p.color(255, 200, 55)  // Accent yellow
          ];
          
          p.setup = () => {
            const canvas = p.createCanvas(heroCanvas.clientWidth, heroCanvas.clientHeight);
            canvas.parent(heroCanvas);
            
            // Create particles
            for (let i = 0; i < 50; i++) {
              particles.push({
                x: p.random(p.width),
                y: p.random(p.height),
                size: p.random(2, 8),
                speed: p.random(0.2, 1),
                color: p.random(colors),
                angle: p.random(p.TWO_PI)
              });
            }
          };
          
          p.draw = () => {
            p.clear();
            
            // Draw connecting lines
            p.stroke(0, 91, 78, 50);
            p.strokeWeight(0.5);
            
            for (let i = 0; i < particles.length; i++) {
              for (let j = i + 1; j < particles.length; j++) {
                const d = p.dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                if (d < 150) {
                  p.line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                }
              }
            }
            
            // Update and draw particles
            particles.forEach(part => {
              // Move particle
              part.x += p.cos(part.angle) * part.speed;
              part.y += p.sin(part.angle) * part.speed;
              
              // Bounce off edges
              if (part.x < 0 || part.x > p.width) part.angle = p.PI - part.angle;
              if (part.y < 0 || part.y > p.height) part.angle = -part.angle;
              
              // Draw particle
              p.noStroke();
              p.fill(part.color);
              p.ellipse(part.x, part.y, part.size);
            });
          };
          
          p.windowResized = () => {
            p.resizeCanvas(heroCanvas.clientWidth, heroCanvas.clientHeight);
          };
        }, heroCanvas);
      }
    }
  
    // Service Worker for PWA capabilities
    initServiceWorker() {
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js').then(
            registration => {
              console.log('ServiceWorker registration successful');
            },
            err => {
              console.log('ServiceWorker registration failed: ', err);
            }
          );
        });
      }
    }
  
    // Lazy Loading for images and components
    initLazyLoading() {
      const lazyImages = document.querySelectorAll('img.lazy');
      const lazyComponents = document.querySelectorAll('[data-lazy-component]');
      
      const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (entry.target.tagName === 'IMG') {
              entry.target.src = entry.target.dataset.src;
              entry.target.classList.remove('lazy');
              lazyObserver.unobserve(entry.target);
            } else if (entry.target.hasAttribute('data-lazy-component')) {
              const componentName = entry.target.dataset.lazyComponent;
              this.loadLazyComponent(componentName, entry.target);
              lazyObserver.unobserve(entry.target);
            }
          }
        });
      }, {
        rootMargin: '200px 0px',
        threshold: 0.01
      });
      
      lazyImages.forEach(img => lazyObserver.observe(img));
      lazyComponents.forEach(comp => lazyObserver.observe(comp));
    }
  
    // Load lazy components dynamically
    async loadLazyComponent(componentName, targetElement) {
      try {
        let component;
        
        switch (componentName) {
          case 'weather-widget':
            component = await import('./components/weather.js');
            component.init(targetElement);
            break;
          case 'currency-converter':
            component = await import('./components/currency.js');
            component.init(targetElement);
            break;
          // More components can be added
        }
        
        targetElement.classList.add('lazy-loaded');
      } catch (error) {
        console.error(`Failed to load ${componentName}:`, error);
        targetElement.innerHTML = `<p class="text-red-500">Component failed to load</p>`;
      }
    }
  
    // Smooth Page Transitions
    initPageTransitions() {
      const links = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([data-no-transition])');
      
      links.forEach(link => {
        link.addEventListener('click', (e) => {
          if (link.href && !link.href.startsWith('javascript:') && link.hostname === window.location.hostname) {
            e.preventDefault();
            
            document.body.classList.add('fade-out');
            
            setTimeout(() => {
              window.location.href = link.href;
            }, 300);
          }
        });
      });
      
      document.body.classList.add('fade-in');
    }
  
    // Micro-interactions for better UX
    initMicroInteractions() {
      // Button hover effects
      document.querySelectorAll('button, [role="button"]').forEach(button => {
        if (!button.classList.contains('no-micro')) {
          button.addEventListener('mousedown', () => {
            button.classList.add('transform', 'scale-95');
          });
          
          button.addEventListener('mouseup', () => {
            button.classList.remove('transform', 'scale-95');
          });
          
          button.addEventListener('mouseleave', () => {
            button.classList.remove('transform', 'scale-95');
          });
        }
      });
      
      // Form input interactions
      document.querySelectorAll('input, textarea, select').forEach(input => {
        const container = input.closest('.input-container') || input.parentElement;
        
        input.addEventListener('focus', () => {
          container.classList.add('ring-2', 'ring-primary', 'border-primary');
          container.classList.remove('border-gray-300');
        });
        
        input.addEventListener('blur', () => {
          container.classList.remove('ring-2', 'ring-primary', 'border-primary');
          container.classList.add('border-gray-300');
        });
      });
      
      // Card hover effects
      document.querySelectorAll('.interactive-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const angleX = (y - centerY) / 20;
          const angleY = (centerX - x) / 20;
          
          card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
      });
    }
  }
  
  // Initialize the app when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    const app = new SriLankaTravelApp();
    
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('SW registered: ', registration);
        }).catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
      });
    }
    
    // Add to homescreen prompt (for PWA)
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      
      const installButton = document.getElementById('install-pwa');
      if (installButton) {
        installButton.style.display = 'block';
        installButton.addEventListener('click', () => {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then(choiceResult => {
            if (choiceResult.outcome === 'accepted') {
              console.log('User accepted install prompt');
            }
            deferredPrompt = null;
          });
        });
      }
    });
  });
  
  // Export for module usage if needed
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SriLankaTravelApp;
  }