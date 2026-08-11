import { mount } from 'svelte'
import '../styles/base.css'
import GauntletTestApp from './GauntletTestApp.svelte'

const app = mount(GauntletTestApp, { target: document.getElementById('app')! })

export default app
