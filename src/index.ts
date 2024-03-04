// entry point
// DO NOT mess this file!

import './styles/index.scss'
import { Message } from './index.d.ts'

const foo = (msg : Message) => {
  console.log(msg.text)
}

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    foo({
      code: 12,
      text: 'Operation of types complete'
    })
  }
}
