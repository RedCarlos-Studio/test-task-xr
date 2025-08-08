test task

## Database structure & model

I’m assuming relational database is used for backend, in case of NoSQL, something different should be built, since it doesn’t work so well with joins. So the stack I would choose for database is PostgreSQL and TypeORM or sequelize (another solution - Prisma, it has a lot of hype, but not so much benefits, after working ~1 year on project that used it, there were major issues with performance and migrations were painful)

Schema image: `schema.webp`

### notifications entity

example with typeORM — see file: `Notification.ts`

## Notifications

several options how to achieve real-time updates: websockets, long polling, streams, I’ll use websockets in my solution.

### notification.service.ts - notifications CRUD

See file: `notification.service.ts`

### notifications.gateway.ts - socket gateway

See file: `notifications.gateway.ts`

### useNotifications.ts - hook for loading data

See file: `useNotifications.ts`

## State and async logic handling

state - depending on scale of application, state manager may be required, for low to mid scale codebases native React contexts may be enough, if choosing between state managers, anything that is not Redux (its used in a lot of places, one of the first state managers, but has terrible development experience) would be fine, my personal preferences are  Redux Toolkit (not same thing as Redux, has support for queries too with RTKQuery) and MobX

### notifications-context.ts - store notifications here, all children of provider will be able to get them

See file: `notifications-context.ts`

### marking notification

another important part - marking notification with {read: true} . one way to do this is to do this straight after receiving a GET request, but that could cause never showing them to user because of bugs or slow network and page reloads. I assume that there is a button like “mark as read” for them and separate endpoint for that. example hook for reading notifications: see file: `useNotifications.ts` (useMarkNotificationsRead)

