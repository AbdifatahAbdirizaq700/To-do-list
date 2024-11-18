export function TaskInbox({ inboxTasks, onAccept, onDecline }) {
    return (
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Task Inbox</h2>
        {inboxTasks.map(task => (
          <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">{task.text}</p>
              <p className="text-sm text-gray-500">From: {task.sender}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => onAccept(task.id)} size="sm">Accept</Button>
              <Button onClick={() => onDecline(task.id)} variant="outline" size="sm">Decline</Button>
            </div>
          </div>
        ))}
      </div>
    )
  }
  