import React from 'react'

const About = () => {
  return (
    <main className='About'>
        <h2>About</h2>
        <p style={{ marginTop: '1rem' }}>
          Calorie Counter is a project in the Senior Design courses 4316 and 4317.<br/>
          Team Members:<br/>
          Conar Bailey<br/>
          Sheena Buwemi<br/>
          Marcia Kimenyembo<br/>
          Laura Luu<br/>
          Mitali Mayani<br/>
          </p>
        <a href="https://platform.fatsecret.com">
            <img alt="Nutrition information provided by fatsecret Platform API" src="https://platform.fatsecret.com/api/static/images/powered_by_fatsecret_horizontal_brand.svg" border="0"/>
        </a>        
    </main>
  )
}

export default About