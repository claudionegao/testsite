const io = require('socket.io-client')

class EasySocket {
  constructor() {
    this.socketInstance = null
    this.connected = false
    this.queue = []
  }

  async connect(url = '', options = {}) {
    if (this.socketInstance) {
      return this.socketInstance
    }

    // Detecta automaticamente a URL do servidor
    let socketUrl = url
    
    if (!socketUrl && typeof window !== 'undefined') {
      // Usa o endereço atual da aplicação
      socketUrl = window.location.origin
    } else if (!socketUrl) {
      // Fallback para ambiente Node.js
      socketUrl = 'http://localhost:3000'
    }

    // Inicializa a rota do Socket.io no servidor
    if (typeof window !== 'undefined') {
      try {
        await fetch('/api/socket')
      } catch (error) {
        console.warn('Could not initialize socket route:', error.message)
      }
    }
    
    this.socketInstance = io(socketUrl, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      ...options
    })

    // Setup connection handlers
    this.socketInstance.on('connect', () => {
      this.connected = true
      console.log('EasySocket connected:', this.socketInstance.id)
      
      // Process queued events
      while (this.queue.length > 0) {
        const { event, data } = this.queue.shift()
        this.socketInstance.emit(event, data)
      }
    })

    this.socketInstance.on('disconnect', () => {
      this.connected = false
      console.log('EasySocket disconnected')
    })

    this.socketInstance.on('connect_error', (error) => {
      console.error('EasySocket connection error:', error)
    })

    return this.socketInstance
  }

  emit(eventName, data) {
    if (!this.socketInstance) {
      console.warn('Socket not initialized. Call connect() first or event will be queued.')
      this.queue.push({ event: eventName, data })
      return
    }

    if (!this.connected) {
      this.queue.push({ event: eventName, data })
      return
    }

    this.socketInstance.emit(eventName, data)
  }

  on(eventName, callback) {
    if (!this.socketInstance) {
      console.error('Socket not initialized. Call connect() first.')
      return
    }

    this.socketInstance.on(eventName, callback)
  }

  off(eventName, callback) {
    if (!this.socketInstance) {
      return
    }

    if (callback) {
      this.socketInstance.off(eventName, callback)
    } else {
      this.socketInstance.off(eventName)
    }
  }

  disconnect() {
    if (this.socketInstance) {
      this.socketInstance.disconnect()
      this.socketInstance = null
      this.connected = false
    }
  }

  getSocket() {
    return this.socketInstance
  }

  isConnected() {
    return this.connected
  }
}

// Singleton instance
const easySocketInstance = new EasySocket()

// Export the instance directly for ease of use
module.exports = easySocketInstance
