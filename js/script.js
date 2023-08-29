const $tabs = document.querySelector(".tabs");
const $searchForm = document.querySelector(".search");
const $searchInput = document.querySelector(".search__input");
const searchRowHeight = document.querySelector(".row--search").offsetHeight;
console.log(searchRowHeight);
const target = document.querySelector('.main-intersection-observer');
const fixedElement = document.querySelector('.search-observer');
let allOpenTabsCount;

const getTabs = async () => {
  let tabs = await chrome.tabs.query({ currentWindow: true });
  allOpenTabsCount = tabs.length;
  return tabs;
};

const createTabs = (tabs) => {

  $tabs.innerHTML = "";

  const pinnedTabs = tabs.filter((tab) => tab.pinned);

  if (pinnedTabs.length > 0) {
    createTabsTitle("Pinned Tabs", $tabs);
    const $pinnedTabs = createTabsList("tabs__list--pinned", $tabs);

    pinnedTabs.forEach((tab) => {
      createTab(tab, $pinnedTabs);
    });

    $pinnedTabs.setAttribute("data-start-index", "0");
  }

  const unpinnedTabs = tabs.filter((tab) => !tab.pinned);

  if (unpinnedTabs.length > 0) {
    createTabsTitle("Open Tabs", $tabs);
    const $unpinnedTabs = createTabsList("tabs__list--unpinned", $tabs);

    unpinnedTabs.forEach((tab) => {
      createTab(tab, $unpinnedTabs);
    });

    $unpinnedTabs.setAttribute("data-start-index", allOpenTabsCount - unpinnedTabs.length);
  }
};

const createTabsList = (className, parent) => {
  const $tabsList = document.createElement("ul");
  $tabsList.classList.add("tabs__list", className);
  parent.appendChild($tabsList);
  return $tabsList;
}

const createTabsTitle = (title, parent) => {
  const $title = document.createElement("h2");
  $title.classList.add("tabs__title");
  $title.innerText = title;
  parent.appendChild($title);
};

const createTab = (tab, list) => {
  const $list = list;
  const $tab = document.createElement("li");
  $tab.setAttribute("data-tab-id", tab.id);
  $list.appendChild($tab);
  populateTab(tab);
}

const stripDomain = (url) => {
  const regex = /^(?:https?:\/\/)?(?:[^/]+\.)?([^./]+\.[^./]+)(?:\/.*)?$/i;
  const match = url.match(regex);
  if (match) {
    return match[1];
  } else {
    return url;
  }
}

const populateTab = (tab) => {
  const $tab = document.querySelector(`[data-tab-id="${tab.id}"]`);

  if ($tab === null) {
    return;
  } else {
    $tab.innerHTML = "";

    let faviconSrc = tab.favIconUrl;
    let favicon;

    // check if the favicon exists
    if (tab.favIconUrl === "" || tab.favIconUrl === undefined || tab.favIconUrl === null) {
      favicon = `<svg class="tab__favicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M88,128c0,37.46,13.33,70.92,34.28,93.49a7.77,7.77,0,0,0,11.44,0C154.67,198.92,168,165.46,168,128s-13.33-70.92-34.28-93.49a7.77,7.77,0,0,0-11.44,0C101.33,57.08,88,90.54,88,128Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="37.46" y1="96" x2="218.54" y2="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="37.46" y1="160" x2="218.54" y2="160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>`;
    } else {
      favicon = `<img class="tab__favicon" src="${faviconSrc}" alt="Favicon" loading="lazy" class="tab__favicon">`;
    }

    $tab.classList.add("tab");
    // add a data atribute of tab index
    $tab.setAttribute("data-tab-index", tab.index);
    let tabUrl = stripDomain(tab.url);
    $tab.innerHTML = `
        ${favicon}
        <a class="tab__link" href="${tab.url}" target="_blank">${tab.title}</a>
        <span class="tab__url">${tabUrl}</span>
        <div class="tab__actions">
          <button class="tab__action tab__pin">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><line x1="128" y1="176" x2="128" y2="240" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="48" y1="40" x2="208" y2="216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="171.64" y1="176" x2="40" y2="176" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="56" y1="176" x2="74.8" y2="69.48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="102.06" y1="40" x2="192" y2="40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="176" y1="40" x2="193.81" y2="140.93" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><line x1="128" y1="176" x2="128" y2="240" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="64" y1="40" x2="192" y2="40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="40" y1="176" x2="216" y2="176" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="56" y1="176" x2="80" y2="40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="176" y1="40" x2="200" y2="176" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
          </button>
          <button class="tab__action tab__copy">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><polyline points="40 144 96 200 224 72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><polyline points="168 168 216 168 216 40 88 40 88 88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><rect x="40" y="88" width="128" height="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
          </button>
          <button class="tab__action tab__close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><line x1="200" y1="56" x2="56" y2="200" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="200" y1="200" x2="56" y2="56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
          </button>
        </div>
        `;

    setTabStatus(tab);

    // an event listener on the li element to open the tab but don't click on the buttons
    $tab.addEventListener("click", (e) => {
      if (e.target.classList.contains("tab__action")) {
        return;
      }
      else {
        chrome.tabs.update(tab.id, { active: true });
      }
    });

    // event listener when clicking on the link
    const $link = $tab.querySelector(".tab__link");
    $link.addEventListener("click", (e) => {
      e.preventDefault();
    });

    // event listener when clicking on the copy button
    const $copyButton = $tab.querySelector(".tab__copy");
    $copyButton.addEventListener("click", () => {
      const $url = $tab.querySelector(".tab__url");
      const url = $url.innerText;
      navigator.clipboard.writeText(url);
      // add a class of "copied" to the button for 1 second
      $copyButton.classList.add("copied");
      setTimeout(() => {
        $copyButton.classList.remove("copied");
      }, 1000);
    });

    // event listener when clicking on the pin button
    const $pinButton = $tab.querySelector(".tab__pin");
    $pinButton.addEventListener("click", () => {
      chrome.tabs.update(tab.id, { pinned: !tab.pinned });
      $tab.classList.toggle("is-pinned");
    });

    // event listener when clicking on the close button
    const $closeButton = $tab.querySelector(".tab__close");
    $closeButton.addEventListener("click", () => {
      chrome.tabs.remove(tab.id);
    });
  }
}

const setTabStatus = (tab) => {
  const $tab = document.querySelector(`[data-tab-id="${tab.id}"]`);
  // check if $tab is not null
  if ($tab === null) {
    return;
  } else {
    // remove all the status classes starting with is-
    $tab.classList.remove(...Array.from($tab.classList).filter((c) => c.startsWith("is-")));
    $tab.classList.add("is-" + tab.status);
    if (tab.pinned) {
      $tab.classList.add("is-pinned");
    };
  }
};

const searchTabs = (tabs) => {
  // prevent the form from submitting
  $searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
  });

  $searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const filteredTabs = tabs.filter((tab) => {
      return tab.title.toLowerCase().includes(query);
    });
    createTabs(filteredTabs);
  });

  $searchForm.addEventListener("reset", (e) => {
    createTabs(tabs);
  });
};

const init = async () => {
  let tabs = await getTabs();
  // filter tabs to only include tabs that are not chrome:// tabs
  // tabs = tabs.filter(tab => !tab.url.includes('chrome://'));
  createTabs(tabs);
  searchTabs(tabs);


  // event listener when a tab is closed
  chrome.tabs.onRemoved.addListener(async (tabId) => {
    const $removedTab = document.querySelector(`[data-tab-id="${tabId}"]`);
    if ($removedTab === null) {
      return;
    } else {
      $removedTab.remove();
      let newTabs = await getTabs();
      createTabs(newTabs);
    }
  });

  // event listener when a tab is created
  chrome.tabs.onCreated.addListener((tab) => {
    const $tabsList = document.querySelector(".tabs__list--unpinned");
    createTab(tab, $tabsList);
  });

  // event listener when a tab is moved
  chrome.tabs.onMoved.addListener(async () => {
    let movedTabs = await getTabs();
    createTabs(movedTabs);
  });


  // event listener when a tab is updated
  chrome.tabs.onUpdated.addListener(async () => {
    let updatedTabs = await getTabs();
    createTabs(updatedTabs);
  });
}

init();