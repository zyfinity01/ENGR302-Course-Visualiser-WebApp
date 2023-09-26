export const LabelNode = ({ data }: any) => {
  return (
    <div style={{ background: 'none', border: 'none' }}>
      <strong>{data.label}</strong>
    </div>
  )
}
