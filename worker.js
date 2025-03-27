// Utility functions for generating random content
class UtilityGenerator {
  static generateUUID() {
    return crypto.randomUUID();
  }

  static generatePassword(length = 16, options = {}) {
    const charsets = {
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
    };

    const similarChars = 'oOiIlL10';
    const ambiguousChars = '{}[]()/\'"`~,;:.<>';

    if (length < 8 || length > 256) {
      throw new Error('Password length must be between 8 and 256 characters');
    }

    let chars = Object.entries(options)
      .filter(([key, value]) => value && charsets[key])
      .map(([key]) => charsets[key])
      .join('');

    if (!chars) {
      chars = Object.values(charsets).join('');
    }

    if (options.excludeSimilar) {
      chars = chars.split('').filter(c => !similarChars.includes(c)).join('');
    }
    if (options.excludeAmbiguous) {
      chars = chars.split('').filter(c => !ambiguousChars.includes(c)).join('');
    }

    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => chars[byte % chars.length]).join('');
  }

  static async getQRCodeURL(text, size = 350) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
  }
}

const getHTML = () => `
<!DOCTYPE html>
<html lang="en" x-data="app" x-init="initTheme()">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Utility Generator</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            primary: {
              50: '#f0f9ff',
              100: '#e0f2fe',
              200: '#bae6fd',
              300: '#7dd3fc',
              400: '#38bdf8',
              500: '#0ea5e9',
              600: '#0284c7',
              700: '#0369a1',
              800: '#075985',
              900: '#0c4a6e'
            }
          }
        }
      }
    }
  </script>
  <style>
    [x-cloak] { display: none !important; }
  </style>
</head>
<body 
  class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 ease-in-out"
>
  <div class="container mx-auto px-4 py-8 max-w-xl">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-primary-700 dark:text-primary-400">
        Utility Generator
      </h1>
      
      <button 
        @click="toggleTheme()" 
        class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        aria-label="Toggle dark mode"
      >
        <svg x-show="theme === 'dark'" class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"></path>
        </svg>
        <svg x-show="theme === 'light'" class="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
        </svg>
      </button>
    </div>

    <!-- UUID Generator -->
    <div 
      x-data="uuidGenerator" 
      class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700"
    >
      <h2 class="text-xl font-semibold mb-4 text-primary-700 dark:text-primary-400">
        Generate UUID
      </h2>
      <button 
        @click="generate()" 
        class="w-full btn bg-primary-500 hover:bg-primary-600 text-white py-2 rounded transition-colors"
      >
        Generate UUID
      </button>
      <div x-show="result" x-cloak class="mt-4">
        <div class="bg-primary-100 dark:bg-primary-900 p-3 rounded break-all text-primary-800 dark:text-primary-200">
          <span x-text="result"></span>
        </div>
        <button 
          @click="copyToClipboard()" 
          class="mt-2 w-full btn bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 rounded transition-colors"
        >
          Copy UUID
        </button>
      </div>
    </div>

    <!-- Password Generator -->
    <div 
      x-data="passwordGenerator" 
      class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700"
    >
      <h2 class="text-xl font-semibold mb-4 text-primary-700 dark:text-primary-400">
        Generate Password
      </h2>
      <div class="space-y-4">
        <select 
          x-model.number="length" 
          class="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100"
        >
          <option value="16">16 characters</option>
          <option value="32">32 characters</option>
          <option value="64">64 characters</option>
          <option value="128">128 characters</option>
        </select>

        <div class="space-y-2">
          <label class="flex items-center text-gray-800 dark:text-gray-200">
            <input 
              type="checkbox" 
              x-model="options.lowercase" 
              class="mr-2 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            >
            Include Lowercase
          </label>
          <label class="flex items-center text-gray-800 dark:text-gray-200">
            <input 
              type="checkbox" 
              x-model="options.uppercase" 
              class="mr-2 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            >
            Include Uppercase
          </label>
          <label class="flex items-center text-gray-800 dark:text-gray-200">
            <input 
              type="checkbox" 
              x-model="options.numbers" 
              class="mr-2 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            >
            Include Numbers
          </label>
          <label class="flex items-center text-gray-800 dark:text-gray-200">
            <input 
              type="checkbox" 
              x-model="options.symbols" 
              class="mr-2 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            >
            Include Symbols
          </label>
        </div>

        <button 
          @click="generate()" 
          class="w-full btn bg-primary-500 hover:bg-primary-600 text-white py-2 rounded transition-colors"
        >
          Generate Password
        </button>

        <div x-show="result" x-cloak class="mt-4">
          <div class="bg-primary-100 dark:bg-primary-900 p-3 rounded break-all text-primary-800 dark:text-primary-200">
            <span x-text="result"></span>
          </div>
          <button 
            @click="copyToClipboard()" 
            class="mt-2 w-full btn bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 rounded transition-colors"
          >
            Copy Password
          </button>
        </div>
      </div>
    </div>

    <!-- QR Code Generator -->
    <div 
      x-data="qrCodeGenerator" 
      class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700"
    >
      <h2 class="text-xl font-semibold mb-4 text-primary-700 dark:text-primary-400">
        Generate QR Code
      </h2>
      <input 
        x-model="text" 
        placeholder="Enter text for QR Code" 
        class="w-full p-2 border rounded mb-4 bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100"
      >
      <button 
        @click="generate()" 
        class="w-full btn bg-primary-500 hover:bg-primary-600 text-white py-2 rounded transition-colors"
      >
        Generate QR Code
      </button>
      <div x-show="qrCodeUrl" x-cloak class="mt-4 text-center">
        <img :src="qrCodeUrl" alt="QR Code" class="mx-auto max-w-full h-auto rounded shadow-md">
      </div>
    </div>
  </div>

  <script>
    document.addEventListener('alpine:init', () => {
      // Theme Management
      Alpine.data('app', () => ({
        theme: localStorage.getItem('theme') || 'light',
        
        initTheme() {
          document.documentElement.classList.toggle('dark', this.theme === 'dark');
        },
        
        toggleTheme() {
          this.theme = this.theme === 'dark' ? 'light' : 'dark';
          localStorage.setItem('theme', this.theme);
          document.documentElement.classList.toggle('dark');
        }
      }));

      // UUID Generator
      Alpine.data('uuidGenerator', () => ({
        result: '',
        async generate() {
          const response = await fetch("/generate-uuid");
          const data = await response.json();
          this.result = data.uuid;
        },
        copyToClipboard() {
          navigator.clipboard.writeText(this.result).then(() => {
            alert('Copied to clipboard!');
          });
        }
      }));

      // Password Generator
      Alpine.data('passwordGenerator', () => ({
        result: '',
        length: 16,
        options: {
          lowercase: true,
          uppercase: true,
          numbers: true,
          symbols: false
        },
        async generate() {
          const params = new URLSearchParams({
            length: this.length,
            ...Object.fromEntries(
              Object.entries(this.options).map(([k, v]) => [k, v.toString()])
            )
          });
          const response = await fetch("/generate-password?" + params);
          const data = await response.json();
          this.result = data.password;
        },
        copyToClipboard() {
          navigator.clipboard.writeText(this.result).then(() => {
            alert('Copied to clipboard!');
          });
        }
      }));

      // QR Code Generator
      Alpine.data('qrCodeGenerator', () => ({
        text: '',
        qrCodeUrl: '',
        async generate() {
          const response = await fetch("/generate-qrcode?text=" + encodeURIComponent(this.text));
          const data = await response.json();
          this.qrCodeUrl = data.qrCodeURL;
        }
      }));
    });
  </script>
</body>
</html>`;

// Request handler remains the same as in the previous implementation
async function handleRequest(request) {
  try {
    const url = new URL(request.url);
    
    switch (url.pathname) {
      case "/":
        return new Response(getHTML(), {
          headers: { "Content-Type": "text/html" },
        });
      
      case "/generate-uuid":
        return new Response(JSON.stringify({ 
          uuid: UtilityGenerator.generateUUID() 
        }), {
          headers: { "Content-Type": "application/json" },
        });
      
      case "/generate-password":
        try {
          const length = parseInt(url.searchParams.get("length")) || 16;
          const options = {
            lowercase: url.searchParams.get("lowercase") === "true",
            uppercase: url.searchParams.get("uppercase") === "true",
            numbers: url.searchParams.get("numbers") === "true",
            symbols: url.searchParams.get("symbols") === "true"
          };
          
          return new Response(JSON.stringify({ 
            password: UtilityGenerator.generatePassword(length, options) 
          }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
      
      case "/generate-qrcode":
        const text = url.searchParams.get("text") || "Hello, World!";
        const qrCodeURL = await UtilityGenerator.getQRCodeURL(text);
        
        return new Response(JSON.stringify({ qrCodeURL }), {
          headers: { "Content-Type": "application/json" },
        });
      
      default:
        return new Response("Not Found", { status: 404 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: "Internal Server Error", 
      details: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});
