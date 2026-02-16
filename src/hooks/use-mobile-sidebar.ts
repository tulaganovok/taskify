import { create } from 'zustand'

type MobileStore = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useMobileSidebar = create<MobileStore>(set => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
