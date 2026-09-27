# Task 2 Brief: Shared Kernel (DDD Domain Primitives, Event Bus & Zen UI Kit)

**Files:**
- Create: `src/shared/domain/Result.ts`
- Create: `src/shared/domain/BaseEntity.ts`
- Create: `src/shared/domain/ValueObject.ts`
- Create: `src/shared/domain/DomainEvent.ts`
- Create: `src/shared/infrastructure/LocalStorageDriver.ts`
- Create: `src/shared/infrastructure/WebAudioService.ts`
- Create: `src/shared/infrastructure/InMemoryEventBus.ts`
- Create: `src/shared/presentation/Button.tsx`
- Create: `src/shared/presentation/Card.tsx`
- Create: `src/shared/presentation/Modal.tsx`
- Create: `src/shared/presentation/Badge.tsx`
- Create: `src/shared/presentation/Input.tsx`
- Create: `src/shared/presentation/index.ts`
- Test: `tests/shared/Result.test.ts`
- Test: `tests/shared/LocalStorageDriver.test.ts`
- Test: `tests/shared/InMemoryEventBus.test.ts`
- Test: `tests/shared/ZenUIKit.test.tsx`

**Interfaces:**
- Consumes: `clsx`, `tailwind-merge`, `lucide-react`, `framer-motion`.
- Produces:
  1. `Result<T, E>` functional error handling utility with `.ok()`, `.err()`, `.isOk()`, `.isErr()`, `.map()`, `.unwrap()`.
  2. `BaseEntity<TId>` abstract class with `id`, `createdAt`, `updatedAt`, `equals()`.
  3. `ValueObject<TProps>` abstract class with deep equality comparison.
  4. `DomainEvent` interface (`eventId`, `occurredAt`, `eventName`).
  5. `LocalStorageDriver` with safe JSON parsing, typed `getItem<T>()`, `setItem<T>()`, `removeItem()`, and error catching.
  6. `WebAudioService` (Web Audio API synth for gentle Zen bell chime frequencies ~528Hz / gentle chime).
  7. `InMemoryEventBus` implementing publish/subscribe for decoupled domain events.
  8. Zen UI Kit:
     - `Button`: Clean, rounded-xl button with variants `primary` (sage), `secondary` (sand/stone), `outline`, `ghost`, `emergency` (warm amber), supporting icons, disabled states, and subtle tap animations.
     - `Card`: Rounded-2xl card with soft borders, padding options, and clean shadow.
     - `Modal`: Accessible dialog with backdrop blur, smooth entrance/exit (Framer Motion), escape key handling, and title/close button.
     - `Badge`: Soft category/status tags with subtle pastel background and rounded-full styling.
     - `Input`: Zen-styled form input & textarea with focus ring in sage-500.

### Step-by-Step Instructions:

1. **Write failing unit tests**:
   - `tests/shared/Result.test.ts`: Test ok, err, map, unwrap, isOk, isErr.
   - `tests/shared/LocalStorageDriver.test.ts`: Test setItem, getItem, fallback on corrupt JSON, removeItem.
   - `tests/shared/InMemoryEventBus.test.ts`: Test subscribe, publish, unsubscribe.
   - `tests/shared/ZenUIKit.test.tsx`: Test Button, Card, Modal, Badge, Input rendering and events.

2. **Implement Domain Primitives**:
   - `src/shared/domain/Result.ts`
   - `src/shared/domain/BaseEntity.ts`
   - `src/shared/domain/ValueObject.ts`
   - `src/shared/domain/DomainEvent.ts`

3. **Implement Infrastructure Drivers**:
   - `src/shared/infrastructure/LocalStorageDriver.ts`
   - `src/shared/infrastructure/WebAudioService.ts`
   - `src/shared/infrastructure/InMemoryEventBus.ts`

4. **Implement Zen UI Kit**:
   - `src/shared/presentation/Button.tsx`
   - `src/shared/presentation/Card.tsx`
   - `src/shared/presentation/Modal.tsx`
   - `src/shared/presentation/Badge.tsx`
   - `src/shared/presentation/Input.tsx`
   - `src/shared/presentation/index.ts`

5. **Run all shared tests**:
   Run: `npx vitest run tests/shared/` to ensure 100% pass.

6. **Commit**:
   `git add src/shared/ tests/shared/` and `git commit -m "feat: implement shared kernel (DDD primitives, Result type, LocalStorage driver, EventBus, Zen UI Kit)"`.
