import React from 'react'

const SubHeading = ({label}: {label : string}) => {
  return (
    <h3 className='opacity-75 font-bold text-xl line-clamp-1'>{label}</h3>
  )
}

export default SubHeading