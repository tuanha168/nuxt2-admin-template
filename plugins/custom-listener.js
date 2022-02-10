window.addEventListener(
  'storage',
  function (event) {
    if (event.key === 'auth._token.local') {
      location.reload()
    }
  },
  false
)
