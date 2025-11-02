document.addEventListener('DOMContentLoaded', () => {
  const phenomenonCard = document.getElementById('phenomenon-card');
  const articleId = window.location.pathname.split('/').pop();

  if (phenomenonCard && articleId) {
    fetch(`/gateway/phenomenon/${articleId}`)
      .then((response) => response.json())
      .then((data) => {
        phenomenonCard.innerHTML = `
          <h2>Phenomenon Card</h2>
          <ul>
            ${data.properties
              .map(
                (prop) => `
              <li>
                <strong>${prop.property}:</strong> ${prop.value}
              </li>
            `,
              )
              .join('')}
          </ul>
        `;
      });
  }
});
