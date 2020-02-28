import type { PlaygroundPlugin, PluginUtils } from "./vendor/playground"

const makePlugin = (utils: PluginUtils) => {
  const customPlugin: PlaygroundPlugin = {
    id: 'example',
    displayName: 'My Awesome Plugin',
    didMount: (sandbox, container) => {
      console.log('Showing new plugin')

      const p = (str: string) => utils.el(str, "p", container);
      const h4 = (str: string) => utils.el(str, "h4", container);

      h4("Example Plugin")

      p("This plugin has a button which changes the text in the editor, click below to test it.")

      const startButton = document.createElement('input')
      startButton.type = 'button'
      startButton.value = 'Change the code in the editor'
      container.appendChild(startButton)

      const gistInput = document.createElement('input')
      gistInput.placeholder = "Your gist url"
      container.appendChild(gistInput)

      const gistId = '3b4c3ebc2aa29d30b914aea2d7ba4ed5'

      const gistBtnContainer = document.createElement('div')
      gistBtnContainer.style.display = 'flex'
      gistBtnContainer.style.flexDirection = 'column'
      container.appendChild(gistBtnContainer)

      startButton.onclick = async () => {
        gistBtnContainer.innerHTML = ""
        const url = gistInput.value //`${gistInput.value}/raw/`.replace('gist.github.com', 'gist.githubusercontent.com');
        const id = url.match(/https:\/\/gist.(github|githubusercontent).com\/\w+\/([^\/]+)/)![2]
        console.log(id)
        const filesResponse = await fetch(`https://api.github.com/gists/${id}`)
        const {files} = await filesResponse.json()
        Object.values(files).forEach((gist: any) => {
          const btn = document.createElement('button')
          btn.textContent = gist.filename
          btn.onclick = async () => {
            const contents = await fetch(gist.raw_url)
            sandbox.setText(await contents.text())
          }
          gistBtnContainer.appendChild(btn)
        })
        // console.log(Object.keys(files))
        // https://api.github.com/v3/gist/id
      }

      container.appendChild(document.createElement('hr'))

      const kitten = document.createElement('img')
      kitten.src = 'http://placekitten.com/300/300'
      container.appendChild(kitten)

      // https://gist.github.com/ashfurrow/3b4c3ebc2aa29d30b914aea2d7ba4ed5
      // https://gist.githubusercontent.com/ashfurrow/3b4c3ebc2aa29d30b914aea2d7ba4ed5/raw/5a0ebd67ed66a680816e991359f29ecb0f4a56f9/index.ts
      // https://gist.githubusercontent.com/ashfurrow/3b4c3ebc2aa29d30b914aea2d7ba4ed5/raw/
    },

    // This is called occasionally as text changes in monaco,
    // it does not directly map 1 keyup to once run of the function
    // because it is intentionally called at most once every 0.3 seconds
    // and then will always run at the end.
    modelChangedDebounce: async (_sandbox, _model) => {
      // Do some work with the new text
    },

    // Gives you a chance to remove anything set up,
    // the container itself if wiped of children after this.
    didUnmount: () => {
      console.log('Removing plugin')
    },
  }

  return customPlugin
}

export default makePlugin
