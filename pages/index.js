import { useEffect, useState } from 'react'
import socket from 'easysocket'
import styled from 'styled-components'

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`

const Title = styled.h1`
  color: #333;
  text-align: center;
  margin-bottom: 30px;
`

const Section = styled.div`
  background: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`

const SectionTitle = styled.h2`
  font-size: 18px;
  color: #555;
  margin-bottom: 15px;
`

const InputGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
`

const Input = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;

  &:hover {
    background-color: #45a049;
  }

  &:active {
    background-color: #3d8b40;
  }
`

const RemoveButton = styled(Button)`
  background-color: #f44336;
  padding: 5px 10px;
  font-size: 12px;

  &:hover {
    background-color: #da190b;
  }
`

const ListenerItem = styled.div`
  background: white;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ListenerName = styled.span`
  font-weight: bold;
  color: #333;
`

const MessagesArea = styled.div`
  background: white;
  border-radius: 4px;
  padding: 15px;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #ddd;
`

const Message = styled.div`
  padding: 8px;
  margin-bottom: 8px;
  background: #e3f2fd;
  border-left: 3px solid #2196F3;
  border-radius: 4px;
  font-size: 14px;
`

const EventName = styled.span`
  font-weight: bold;
  color: #1976D2;
  margin-right: 8px;
`

const MessageText = styled.span`
  color: #333;
`

const Timestamp = styled.span`
  font-size: 12px;
  color: #999;
  margin-left: 8px;
`

export default function Home() {
  const [eventName, setEventName] = useState('')
  const [message, setMessage] = useState('')
  const [listenerEvent, setListenerEvent] = useState('')
  const [listeners, setListeners] = useState([])
  const [messages, setMessages] = useState([])

  useEffect(() => {
    socketInitializer()

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!socket.getSocket()) return

    // Remove all previous listeners
    listeners.forEach(listener => {
      socket.off(listener)
    })

    // Add listeners for each configured event
    listeners.forEach(listener => {
      socket.on(listener, (data) => {
        const newMessage = {
          event: listener,
          data: data,
          timestamp: new Date().toLocaleTimeString()
        }
        setMessages(prev => [...prev, newMessage])
      })
    })
  }, [listeners])

  const socketInitializer = async () => {
    await socket.connect()
  }

  const handleSendEvent = (e) => {
    e.preventDefault()
    if (eventName && message) {
      socket.emit(eventName, message)
      setEventName('')
      setMessage('')
    }
  }

  const handleAddListener = (e) => {
    e.preventDefault()
    if (listenerEvent && !listeners.includes(listenerEvent)) {
      setListeners([...listeners, listenerEvent])
      setListenerEvent('')
    }
  }

  const handleRemoveListener = (listener) => {
    setListeners(listeners.filter(l => l !== listener))
    socket.off(listener)
  }

  return (
    <Container>
      <Title>Socket.IO Test App</Title>

      <Section>
        <SectionTitle>Enviar Evento</SectionTitle>
        <form onSubmit={handleSendEvent}>
          <InputGroup>
            <Input
              type="text"
              placeholder="Nome do evento"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Mensagem"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit">Enviar</Button>
          </InputGroup>
        </form>
      </Section>

      <Section>
        <SectionTitle>Adicionar Listener</SectionTitle>
        <form onSubmit={handleAddListener}>
          <InputGroup>
            <Input
              type="text"
              placeholder="Nome do evento para escutar"
              value={listenerEvent}
              onChange={(e) => setListenerEvent(e.target.value)}
            />
            <Button type="submit">Adicionar Listener</Button>
          </InputGroup>
        </form>

        {listeners.length > 0 && (
          <div>
            <h3 style={{ fontSize: '16px', marginTop: '15px', marginBottom: '10px' }}>
              Listeners Ativos:
            </h3>
            {listeners.map((listener, index) => (
              <ListenerItem key={index}>
                <ListenerName>{listener}</ListenerName>
                <RemoveButton onClick={() => handleRemoveListener(listener)}>
                  Remover
                </RemoveButton>
              </ListenerItem>
            ))}
          </div>
        )}
      </Section>

      <Section>
        <SectionTitle>Mensagens Recebidas</SectionTitle>
        <MessagesArea>
          {messages.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center' }}>
              Nenhuma mensagem recebida ainda
            </p>
          ) : (
            messages.map((msg, index) => (
              <Message key={index}>
                <EventName>[{msg.event}]</EventName>
                <MessageText>{msg.data}</MessageText>
                <Timestamp>{msg.timestamp}</Timestamp>
              </Message>
            ))
          )}
        </MessagesArea>
      </Section>
    </Container>
  )
}
