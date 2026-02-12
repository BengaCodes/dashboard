const Loading = () => {
  return (
    <div className='loader flex justify-center align-middle'>
      <div className='box'>
        <div className='top-side'></div>
        <div className='bottom-side'></div>

        <div className='screen'>
          <div className='lightray-limit'>
            <div className='lightray'></div>
          </div>

          <div className='loader-box'>
            <div className='progress'></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loading
