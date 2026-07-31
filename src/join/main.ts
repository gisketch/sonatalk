import { mount } from 'svelte'
import '../styles/base.css'
import './join.css'
import JoinApp from './JoinApp.svelte'

const app = mount(JoinApp, { target: document.getElementById('app')! })

export default app
