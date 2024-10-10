import './slider.css'

const Slider = ({value, onChange}) => {
  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value)
    onChange(newValue)
  }

  return (
    <div className="light-slider">
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={handleChange}
      />
    </div>
  )
}

export default Slider