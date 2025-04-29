import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import { AppDispatch, RootState } from '@/store'  // Adjust path to store.ts if needed

// `useAppDispatch` typed to return `AppDispatch`
export const useAppDispatch: () => AppDispatch = useDispatch

// `useAppSelector` typed to return `RootState`
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
