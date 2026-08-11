import { mount } from 'svelte'
import '../styles/base.css'
import RacingApp from './RacingApp.svelte'

const app = mount(RacingApp, { target: document.getElementById('app')! })

export default app
