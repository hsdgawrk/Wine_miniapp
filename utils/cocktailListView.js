const SORT_MODES = {
  UPDATED_AT: 'updatedAt',
  NAME: 'name'
};

const SORT_OPTIONS = ['最近保存', '酒名'];

function buildCocktailListView(options = {}) {
  const {
    cocktails = [],
    query = '',
    sortMode = '',
    selectedIds = [],
    source = '',
    ingredientsPreviewLimit = 3,
    ingredientsPreviewEllipsis = true
  } = options;
  const sourceItems = filterBySource(cocktails, source);
  const sortedItems = sortCocktails(sourceItems, sortMode);
  const selectedMap = buildIdMap(selectedIds);
  const allItems = sortedItems.map((cocktail, index) => decorateCocktail(cocktail, index, {
    selectedMap,
    ingredientsPreviewLimit,
    ingredientsPreviewEllipsis
  }));
  const items = searchCocktails(allItems, query);
  const customCount = sourceItems.filter((cocktail) => cocktail.source === 'custom').length;

  return {
    allItems,
    items,
    totalCount: sourceItems.length,
    filteredCount: items.length,
    customCount,
    builtInCount: Math.max(0, sourceItems.length - customCount),
    selectedCount: selectedIds.length,
    allVisibleSelected: areAllVisibleSelected(items, selectedIds)
  };
}

function decorateCocktail(cocktail, index = 0, options = {}) {
  if (!cocktail) {
    return null;
  }

  const selectedMap = options.selectedMap || {};
  const ingredients = Array.isArray(cocktail.ingredients) ? cocktail.ingredients : [];
  const previewLimit = Number(options.ingredientsPreviewLimit) || 3;
  const preview = ingredients.slice(0, previewLimit).join(' / ');
  const hasMoreIngredients = ingredients.length > previewLimit;
  const ingredientsPreview = `${preview}${hasMoreIngredients && options.ingredientsPreviewEllipsis !== false ? ' / ...' : ''}`;

  return {
    ...cocktail,
    listIndex: String(index + 1).padStart(2, '0'),
    sourceText: cocktail.source === 'custom' ? '私藏' : '馆藏',
    ingredientCount: ingredients.length,
    ingredientsPreview,
    updatedAtText: formatDate(cocktail.updatedAt || cocktail.createdAt),
    isSelected: Boolean(selectedMap[cocktail.id])
  };
}

function searchCocktails(cocktails = [], query = '') {
  const lowerQuery = String(query || '').trim().toLowerCase();
  if (!lowerQuery) {
    return cocktails;
  }

  return cocktails.filter((cocktail) => {
    const searchableText = [
      cocktail.name || '',
      cocktail.description || '',
      cocktail.difficulty || '',
      cocktail.category || '',
      ...(cocktail.ingredients || [])
    ].join(' ').toLowerCase();

    return searchableText.includes(lowerQuery);
  });
}

function sortCocktails(cocktails = [], sortMode = '') {
  const list = [...cocktails];
  if (sortMode === SORT_MODES.NAME) {
    return list.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'zh-Hans-CN'));
  }
  if (sortMode === SORT_MODES.UPDATED_AT) {
    return list.sort((a, b) => (
      Date.parse(b.updatedAt || b.createdAt || 0) - Date.parse(a.updatedAt || a.createdAt || 0)
    ));
  }
  return list;
}

function getSortModeFromIndex(index) {
  return Number(index) === 1 ? SORT_MODES.NAME : SORT_MODES.UPDATED_AT;
}

function getSortLabel(index) {
  return SORT_OPTIONS[Number(index)] || SORT_OPTIONS[0];
}

function filterBySource(cocktails = [], source = '') {
  if (!source) {
    return Array.isArray(cocktails) ? cocktails : [];
  }
  return (Array.isArray(cocktails) ? cocktails : []).filter((cocktail) => cocktail.source === source);
}

function buildIdMap(ids = []) {
  return ids.reduce((map, id) => {
    map[id] = true;
    return map;
  }, {});
}

function areAllVisibleSelected(visibleCocktails = [], selectedIds = []) {
  if (!visibleCocktails.length) {
    return false;
  }
  const selectedMap = buildIdMap(selectedIds);
  return visibleCocktails.every((cocktail) => selectedMap[cocktail.id]);
}

function formatDate(value) {
  if (!value) {
    return '未记录';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '未记录';
  }

  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day} ${hour}:${minute}`;
}

module.exports = {
  SORT_MODES,
  SORT_OPTIONS,
  buildCocktailListView,
  decorateCocktail,
  searchCocktails,
  sortCocktails,
  getSortModeFromIndex,
  getSortLabel,
  buildIdMap,
  areAllVisibleSelected,
  formatDate
};
