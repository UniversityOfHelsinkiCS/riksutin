export const formatDate = (date: string | Date) => new Date(date).toLocaleDateString('fi-FI')

export const formatDateTime = (date: string | Date) => new Date(date).toLocaleString('fi-FI')
