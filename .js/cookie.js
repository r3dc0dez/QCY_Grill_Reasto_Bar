const im = iframemanager();

im.run({
  onChange: ({ changedServices, eventSource }) => {
    if (eventSource.type === 'click') {
      const servicesToAccept = [
        ...CookieConsent.getUserPreferences().acceptedServices['analytics'],
        ...changedServices,
      ];

      CookieConsent.acceptService(servicesToAccept, 'analytics');
      localStorage.setItem('cookieConsentAccepted', 'true');
    }
  },

  currLang: 'en',

  thumbnailUrl: async (dataId, setThumbnail) => {
    const url = `https://vimeo.com/api/v2/video/${dataId}.json`;
    const response = await (await fetch(url)).json();
    const thumbnailUrl = response[0]?.thumbnail_large;
    thumbnailUrl && setThumbnail(thumbnailUrl);
  },

  languages: {
    en: {
      notice:
        'This content is hosted by a third party. By showing the external content you accept the <a rel="noreferrer noopener" href="https://vimeo.com/terms" target="_blank">terms and conditions</a> of vimeo.com.',
      loadBtn: 'Load once',
      loadAllBtn: "Don't ask again",
    },
  },
});

if (!localStorage.getItem('cookieConsentAccepted')) {
  CookieConsent.run({
    guiOptions: {
      consentModal: {
        layout: 'box inline',
        position: 'bottom left',
        equalWeightButtons: true,
        flipButtons: false,
      },
      preferencesModal: {
        layout: 'box',
        equalWeightButtons: true,
        flipButtons: false,
      },
    },

    categories: {
      necessary: {
        readOnly: true,
        enabled: true,
      },

      analytics: {},

      ads: {},
    },

    language: {
      default: 'en',

      translations: {
        en: 'lang/en.json',
      },
    },
  });
}