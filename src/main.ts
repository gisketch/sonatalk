import { mount } from 'svelte'
import './styles/base.css'
import './styles/cards.css'
import './styles/sim.css'
import App from './App.svelte'

const app = mount(App, { target: document.getElementById('app')! })

export default app
