// Content script to inject AI interface into LinkedIn
/*
const injectAIButton = () => {
  document.addEventListener('click', (e) => {
    if (e.target.matches('.comments-comment-box__submit-button')) {
      const commentBox = document.querySelector('.ql-editor.ql-blank');
      if (commentBox && !document.getElementById('ai-comment-btn')) {
        const aiButton = document.createElement('button');
        aiButton.id = 'ai-comment-btn';
        aiButton.innerHTML = '✨ AI Comment';
        aiButton.style.cssText = 'margin-left: 8px; display: inline-flex; align-items: center; position: relative; z-index: 1000;'
        aiButton.addEventListener('click', async (e) => {
          e.preventDefault();
          aiButton.innerHTML = 'Generating...';
          
          const postText = document.querySelector('[data-id="main-feed-card"]')?.innerText || '';
          
          chrome.runtime.sendMessage(
            { action: 'generateComment', postText },
            ({ success, comment, error }) => {
              if (success) {
                commentBox.value = comment;
                commentBox.dispatchEvent(new Event('input', { bubbles: true }));
              } else {
                alert(`AI Error: ${error}`);
              }
              aiButton.innerHTML = '✨ AI Comment';
            }
          );
        });
        const textEditorContainer = commentBox.closest('.comments-comment-texteditor');
if (textEditorContainer) {
  const buttonRow = textEditorContainer.querySelector('.comments-comment-texteditor > div > div:last-child > div:first-child');
  if (buttonRow) {
    buttonRow.prepend(aiButton);
  } else {
    commentBox.closest('.comments-comment-box__main')?.prepend(aiButton);
  }
} else {
  commentBox.parentNode.insertAdjacentElement('afterend', aiButton);
}
      }
    }
  });
};

// Initialize when LinkedIn content loads
new MutationObserver(injectAIButton).observe(document.querySelector('.scaffold-layout__main'), {
    childList: true,
    subtree: true
  });
  */

console.log("Content script loaded");


// jQuery('.comments-comment-box-comment__text-editor').each(function() {
//     jQuery(this).find('.editor-container > div').append('<button id="ai-comment-btn">✨ AI Comment</button>');
// })

jQuery(document).on('click', '.ql-editor', function () {
    const $editor = jQuery(this);
    const $parent = $editor.parent();
    const uniqueId = 'ai-comment-btn-' + Math.random().toString(36).substr(2, 9);

    if (!$parent.next('#' + uniqueId).length) {
        $parent.after(`<button id="${uniqueId}" class="ai-comment-btn">✨ AI Comment</button>`);
    }
});

jQuery(document).on('click', '.ai-comment-btn', function () {
    const $button = jQuery(this);
    const originalText = $button.text();
    $button.text('Generating...');
    
    const post = jQuery(this).parents('.feed-shared-update-v2__control-menu-container').find('.update-components-text').text();
    console.log("Post content:", post.trim());
    
    // Use the background script to make the API request
    chrome.runtime.sendMessage(
        { action: 'generateComment', postText: post.trim() },
        ({ success, comment, error }) => {
            if (success) {
                console.log("Generated comment:", comment);
                // Find the closest editor and insert the comment
                const $editor = $button.siblings('.editor-content').find('p');
                $editor.text(`${comment}`);
                $editor.trigger('input');
            } else {
                console.error('Error:', error);
                alert(`AI Error: ${error}`);
            }
            $button.text(originalText);
        }
    );
})