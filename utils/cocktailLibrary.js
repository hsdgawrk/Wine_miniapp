const cocktailDraft = require('./cocktailDraft');
const cocktailTransfer = require('./cocktailTransfer');

const CUSTOM_COCKTAILS_KEY = 'customCocktails';

const builtInCocktails = [
  {
    id: '1',
    name: '马提尼',
    emoji: '🍸',
    category: '经典',
    description: '金酒的冷冽草本与干味美思的轻盈酒香交织，入口清瘦、利落、带柑橘尾韵',
    history: '马提尼在十九世纪末到二十世纪初逐渐成型，随着金酒、味美思和鸡尾酒杯文化一起成为酒吧审美的标志。它强调冰镇、稀释与香气控制，是检验搅拌技法的经典酒款。',
    difficulty: '简单',
    time: '5分钟',
    popularity: 95,
    ingredients: ['金酒 60ml', '干味美思 10ml', '柠檬皮', '绿橄榄', '冰块'],
    steps: [
      {
        number: 1,
        instruction: '将马天尼杯或鸡尾酒杯提前冰镇，调酒杯中加入足量冰块',
        tips: '杯具温度越低，酒体越能保持清澈锋利',
        estimatedTime: 1,
        animation: 'fadeIn'
      },
      {
        number: 2,
        instruction: '倒入60ml金酒和10ml干味美思',
        tips: '伦敦干金酒会带来更清晰的杜松子和柑橘香',
        estimatedTime: 1,
        animation: 'slideIn'
      },
      {
        number: 3,
        instruction: '用吧勺缓慢搅拌约25秒，让酒液充分降温并适度稀释',
        tips: '不要摇制，搅拌能保留马提尼干净通透的质感',
        estimatedTime: 1,
        animation: 'zoomIn'
      },
      {
        number: 4,
        instruction: '过滤倒入冰镇后的杯中',
        tips: '倒酒前倒掉杯中融水，避免口感被稀释',
        estimatedTime: 1,
        animation: 'fadeIn'
      },
      {
        number: 5,
        instruction: '挤压柠檬皮释放精油，也可改用一颗绿橄榄装饰',
        tips: '柠檬皮更清爽，橄榄会让尾段多一点咸鲜感',
        estimatedTime: 1,
        animation: 'slideIn'
      }
    ]
  },
  {
    id: '2',
    name: '曼哈顿',
    emoji: '🥃',
    category: '经典',
    description: '黑麦威士忌的辛香、甜味美思的草本甜感与苦精香料感叠出沉稳酒体',
    history: '曼哈顿通常被认为兴起于十九世纪后期的纽约，是威士忌、加强葡萄酒与苦精组合的代表。它不像酸酒那样依赖果汁，而是靠搅拌后的温度、稀释和香料层次取胜。',
    difficulty: '中等',
    time: '5分钟',
    popularity: 88,
    ingredients: ['黑麦威士忌 50ml', '甜味美思 20ml', '安格斯特拉苦精 1dash', '酒渍樱桃', '冰块'],
    steps: [
      {
        number: 1,
        instruction: '冰镇鸡尾酒杯，调酒杯中加入足量冰块',
        tips: '曼哈顿适合无冰直饮，预冷杯具很重要',
        estimatedTime: 1,
        animation: 'fadeIn'
      },
      {
        number: 2,
        instruction: '倒入50ml黑麦威士忌、20ml甜味美思和1dash安格斯特拉苦精',
        tips: '黑麦威士忌更辛辣，波本会让整体更圆润甜美',
        estimatedTime: 1,
        animation: 'slideIn'
      },
      {
        number: 3,
        instruction: '用吧勺搅拌约30秒，直到调酒杯外壁明显降温',
        tips: '搅拌动作保持稳定，避免带入过多气泡',
        estimatedTime: 1,
        animation: 'zoomIn'
      },
      {
        number: 4,
        instruction: '过滤倒入冰镇鸡尾酒杯',
        tips: '如果喜欢更厚重的酒体，可以略微缩短搅拌时间',
        estimatedTime: 1,
        animation: 'fadeIn'
      },
      {
        number: 5,
        instruction: '放入酒渍樱桃完成装饰',
        tips: '樱桃糖浆不要倒太多，以免压过威士忌香气',
        estimatedTime: 1,
        animation: 'slideIn'
      }
    ]
  },
  {
    id: '3',
    name: '莫吉托',
    emoji: '🌿',
    category: '清爽',
    description: '白朗姆的甘蔗甜香被薄荷、青柠和苏打水拉亮，清爽、有气泡感且不厚重',
    history: '莫吉托带有鲜明的古巴风格，薄荷、青柠、糖和朗姆构成了热带地区常见的清凉组合。它的关键不是把薄荷捣碎，而是轻柔释放香气并保持杯中气泡活力。',
    difficulty: '简单',
    time: '6分钟',
    popularity: 92,
    ingredients: ['白朗姆酒 45ml', '青柠汁 20ml', '薄荷枝 6枝', '白砂糖 2茶匙', '苏打水', '碎冰'],
    steps: [
      {
        number: 1,
        instruction: '在高球杯中加入薄荷叶、2茶匙白砂糖和20ml新鲜青柠汁',
        tips: '薄荷叶先轻拍再入杯，香气会更自然',
        estimatedTime: 1,
        animation: 'fadeIn'
      },
      {
        number: 2,
        instruction: '轻轻按压薄荷和糖，让糖逐渐溶入青柠汁',
        tips: '不要把薄荷捣成碎渣，否则容易产生草腥和苦味',
        estimatedTime: 1,
        animation: 'slideIn'
      },
      {
        number: 3,
        instruction: '加入少量苏打水和碎冰，再倒入45ml白朗姆酒',
        tips: '先加一点苏打水能帮助糖分散，也能保留气泡层次',
        estimatedTime: 1,
        animation: 'zoomIn'
      },
      {
        number: 4,
        instruction: '补满碎冰，以苏打水加满后从杯底向上轻轻提拉搅拌',
        tips: '动作要轻，目标是混合酒液而不是赶走气泡',
        estimatedTime: 2,
        animation: 'fadeIn'
      },
      {
        number: 5,
        instruction: '用薄荷枝和青柠片装饰',
        tips: '装饰用薄荷枝先拍醒，靠近杯口能增强第一口香气',
        estimatedTime: 1,
        animation: 'slideIn'
      }
    ]
  },
  {
    id: '4',
    name: '血腥玛丽',
    emoji: '🍅',
    category: '早餐酒',
    description: '番茄汁的咸鲜厚度包裹伏特加，柠檬、辣酱和伍斯特酱带出辛香与酸度',
    history: '血腥玛丽在二十世纪酒吧文化中逐渐成为早午餐代表，因可按个人口味调整辣度、盐度和香料而流派众多。它更像一杯带酒精的冷汤，平衡点在鲜味、酸度和辛辣感。',
    difficulty: '简单',
    time: '6分钟',
    popularity: 78,
    ingredients: ['伏特加 45ml', '番茄汁 90ml', '柠檬汁 15ml', '伍斯特酱 2dash', '塔巴斯科辣酱', '芹菜盐', '黑胡椒', '芹菜杆'],
    steps: [
      {
        number: 1,
        instruction: '在调酒杯中加入冰块、45ml伏特加、90ml番茄汁和15ml柠檬汁',
        tips: '番茄汁提前冷藏，成品会更清爽',
        estimatedTime: 1,
        animation: 'fadeIn'
      },
      {
        number: 2,
        instruction: '加入2dash伍斯特酱，并按口味加入塔巴斯科辣酱、芹菜盐和黑胡椒',
        tips: '辣酱和盐先少量加入，试味后再微调',
        estimatedTime: 1,
        animation: 'slideIn'
      },
      {
        number: 3,
        instruction: '用吧勺轻轻搅拌，让番茄汁与调味料完全融合',
        tips: '不要剧烈摇制，番茄汁起泡后口感会显得粗糙',
        estimatedTime: 1,
        animation: 'zoomIn'
      },
      {
        number: 4,
        instruction: '过滤或连冰倒入岩石杯；若想长饮，可倒入装满冰块的高球杯',
        tips: '带冰饮用会让辛辣感更柔和',
        estimatedTime: 1,
        animation: 'fadeIn'
      },
      {
        number: 5,
        instruction: '用芹菜杆和柠檬角装饰，饮用前可再轻轻搅一下',
        tips: '芹菜杆既是装饰，也能作为搅拌棒使用',
        estimatedTime: 1,
        animation: 'slideIn'
      }
    ]
  },
  {
    id: '5',
    name: '玛格丽特',
    emoji: '🥭',
    category: '热带',
    description: '100%龙舌兰的植物辛香、橙酒的甜橙气息和青柠酸度形成明快平衡',
    history: '玛格丽特是龙舌兰鸡尾酒中最具代表性的经典之一，常见做法以龙舌兰、橙酒和青柠汁为核心。半盐边让饮用者能在酸甜与咸鲜之间自由切换，是它最容易被记住的仪式感。',
    difficulty: '中等',
    time: '6分钟',
    popularity: 89,
    ingredients: ['龙舌兰酒 50ml', '三重橙酒 20ml', '青柠汁 15ml', '粗盐', '青柠片', '冰块'],
    steps: [
      {
        number: 1,
        instruction: '用青柠片擦拭杯口半圈，再蘸上薄薄一层粗盐',
        tips: '做半盐边即可，方便根据每一口的需要选择是否碰到盐',
        estimatedTime: 1,
        animation: 'fadeIn'
      },
      {
        number: 2,
        instruction: '在摇壶中加入50ml龙舌兰酒、20ml三重橙酒和15ml新鲜青柠汁',
        tips: '选择100%龙舌兰酒，植物香和酒体会更干净',
        estimatedTime: 1,
        animation: 'slideIn'
      },
      {
        number: 3,
        instruction: '加入冰块后用力摇制约15秒',
        tips: '摇到摇壶外壁结霜即可，过度稀释会削弱青柠的明亮感',
        estimatedTime: 1,
        animation: 'zoomIn'
      },
      {
        number: 4,
        instruction: '过滤倒入冰镇后的鸡尾酒杯',
        tips: '若使用岩石杯，也可以加冰饮用，口感会更轻松',
        estimatedTime: 1,
        animation: 'fadeIn'
      },
      {
        number: 5,
        instruction: '用青柠片装饰，饮用前先闻杯口的青柠香气',
        tips: '盐边、青柠和橙酒香气会先于酒液进入感官',
        estimatedTime: 1,
        animation: 'slideIn'
      }
    ]
  },
  {
    id: '6',
    name: '长岛冰茶',
    emoji: '🧊',
    category: '烈酒',
    description: '伏特加、金酒、朗姆和龙舌兰叠加出强劲底盘，柠檬糖浆与可乐让它像冰茶般顺口',
    history: '长岛冰茶以多种基酒同杯而出名，视觉上接近冰茶，实际酒精感更直接。它的重点不是单纯堆叠烈酒，而是用柠檬、糖浆和可乐把酒体收束到清爽长饮的结构里。',
    difficulty: '困难',
    time: '8分钟',
    popularity: 85,
    ingredients: ['伏特加 15ml', '白朗姆 15ml', '金酒 15ml', '龙舌兰 15ml', '君度 15ml', '柠檬汁 25ml', '糖浆 30ml', '可乐', '冰块'],
    steps: [
      {
        number: 1,
        instruction: '在高球杯中装满冰块',
        tips: '冰块要足，才能让多种烈酒保持清爽而不过分灼热',
        estimatedTime: 1,
        animation: 'fadeIn'
      },
      {
        number: 2,
        instruction: '依次加入15ml伏特加、15ml白朗姆、15ml金酒、15ml龙舌兰和15ml君度',
        tips: '用量要准确，任一基酒过量都会破坏平衡',
        estimatedTime: 2,
        animation: 'slideIn'
      },
      {
        number: 3,
        instruction: '加入25ml柠檬汁和30ml糖浆',
        tips: '新鲜柠檬汁能托住酸度，糖浆负责把烈酒边缘磨圆',
        estimatedTime: 1,
        animation: 'zoomIn'
      },
      {
        number: 4,
        instruction: '用吧勺轻轻搅拌，让基酒、酸和甜先混合均匀',
        tips: '先搅匀再加可乐，成品颜色和甜度会更稳定',
        estimatedTime: 1,
        animation: 'fadeIn'
      },
      {
        number: 5,
        instruction: '以可乐补满杯身，再轻轻提拉一次，最后用柠檬片装饰',
        tips: '可乐只需轻柔混合，避免气泡迅速流失',
        estimatedTime: 1,
        animation: 'slideIn'
      }
    ]
  },
  {
    id: '7',
    name: '威士忌酸',
    emoji: '🍋',
    category: '酸甜',
    description: '波本的香草与橡木感被柠檬酸度提亮，糖浆和蛋白泡沫带来圆润口感',
    history: '威士忌酸属于 Sour 家族，结构清晰：烈酒、酸和甜形成主轴，蛋白则提供绵密质地。它从十九世纪以来一直是威士忌调酒的基础范式，适合练习酸甜平衡。',
    difficulty: '简单',
    time: '6分钟',
    popularity: 82,
    ingredients: ['波本威士忌 45ml', '柠檬汁 25ml', '糖浆 20ml', '蛋白 少量', '安格斯特拉苦精', '橙片', '樱桃', '冰块'],
    steps: [
      {
        number: 1,
        instruction: '在摇壶中加入45ml波本威士忌、25ml柠檬汁、20ml糖浆和少量蛋白',
        tips: '蛋白可选；使用时选择新鲜鸡蛋并注意卫生',
        estimatedTime: 1,
        animation: 'fadeIn'
      },
      {
        number: 2,
        instruction: '不加冰先干摇约10秒，让蛋白产生细腻泡沫',
        tips: '干摇能让泡沫更稳定，口感也更柔顺',
        estimatedTime: 1,
        animation: 'slideIn'
      },
      {
        number: 3,
        instruction: '加入冰块后再次用力摇制约15秒',
        tips: '摇到摇壶明显冰冷即可，酸甜和酒体会更融合',
        estimatedTime: 1,
        animation: 'zoomIn'
      },
      {
        number: 4,
        instruction: '过滤倒入古典杯；可直饮，也可倒在冰块上',
        tips: '带冰版本更适合慢饮，直饮版本香气更集中',
        estimatedTime: 1,
        animation: 'fadeIn'
      },
      {
        number: 5,
        instruction: '滴上少量苦精，并用橙片和樱桃装饰',
        tips: '苦精滴在泡沫表面即可，不需要搅开',
        estimatedTime: 1,
        animation: 'slideIn'
      }
    ]
  },
  {
    id: '8',
    name: '大都会',
    emoji: '💗',
    category: '时尚',
    description: '柑橘伏特加与君度带出清亮果香，蔓越莓和青柠让粉红色酒体酸甜利落',
    history: '大都会在二十世纪后期随着都市酒吧文化走红，因明亮色泽、清爽酸甜和利落杯型成为时尚型鸡尾酒代表。它看似轻盈，实际非常依赖酸度和橙酒甜感的精准平衡。',
    difficulty: '简单',
    time: '5分钟',
    popularity: 87,
    ingredients: ['柑橘伏特加 40ml', '君度 15ml', '青柠汁 15ml', '蔓越莓汁 30ml', '柠檬皮', '冰块'],
    steps: [
      {
        number: 1,
        instruction: '提前冰镇大号鸡尾酒杯',
        tips: '大都会通常无冰上桌，杯具预冷能保持第一口的清爽',
        estimatedTime: 1,
        animation: 'fadeIn'
      },
      {
        number: 2,
        instruction: '在摇壶中加入40ml柑橘伏特加、15ml君度、15ml青柠汁和30ml蔓越莓汁',
        tips: '蔓越莓汁负责颜色和酸甜，不宜过量以免变成果汁感',
        estimatedTime: 1,
        animation: 'slideIn'
      },
      {
        number: 3,
        instruction: '加入冰块后用力摇制约12到15秒',
        tips: '摇制要干脆，让酒体冰冷并带出轻微空气感',
        estimatedTime: 1,
        animation: 'zoomIn'
      },
      {
        number: 4,
        instruction: '细滤倒入冰镇后的鸡尾酒杯',
        tips: '细滤能去除碎冰，让表面更干净',
        estimatedTime: 1,
        animation: 'fadeIn'
      },
      {
        number: 5,
        instruction: '挤压柠檬皮释放精油后放入或弃用，按喜好完成装饰',
        tips: '柠檬皮精油会让第一口更明亮，也能平衡蔓越莓甜感',
        estimatedTime: 1,
        animation: 'slideIn'
      }
    ]
  }
];

const defaultStorageAdapter = {
  getCustomCocktails() {
    return [];
  },
  setCustomCocktails() {}
};

function createCocktailLibrary(options = {}) {
  const storageAdapter = options.storageAdapter || defaultStorageAdapter;
  const now = options.now || (() => new Date());
  let customIdSequence = 0;
  const createId = options.createId || ((createdAt, draft) => {
    customIdSequence += 1;
    return createCustomId({
      ...draft,
      createdAt,
      idSeed: customIdSequence
    });
  });
  let customCocktails = [];
  let cocktails = mergeCocktails(builtInCocktails, customCocktails);

  function init() {
    const result = readCustomCocktails(storageAdapter, now);
    customCocktails = result.cocktails;
    cocktails = mergeCocktails(builtInCocktails, customCocktails);
    if (result.changed) {
      storageAdapter.setCustomCocktails(customCocktails.map(cloneCocktail));
    }
    return listCocktails();
  }

  function listCocktails() {
    return cocktails.map(cloneCocktail);
  }

  function listCustomCocktails() {
    return customCocktails.map(cloneCocktail);
  }

  function countCustomCocktails() {
    return customCocktails.length;
  }

  function searchCocktails(query) {
    return searchCollection(cocktails, query).map(cloneCocktail);
  }

  function searchCustomCocktails(query) {
    return searchCollection(customCocktails, query).map(cloneCocktail);
  }

  function getCocktailById(id) {
    const normalizedId = normalizeId(id);
    if (!normalizedId) {
      return null;
    }

    const cocktail = cocktails.find((item) => normalizeId(item.id) === normalizedId);
    return cocktail ? cloneCocktail(cocktail) : null;
  }

  function getCustomCocktailById(id) {
    const normalizedId = normalizeId(id);
    if (!normalizedId) {
      return null;
    }

    const cocktail = customCocktails.find((item) => normalizeId(item.id) === normalizedId);
    return cocktail ? cloneCocktail(cocktail) : null;
  }

  function getCocktailByName(name) {
    const normalizedName = decodeValue(name).trim();
    if (!normalizedName) {
      return null;
    }

    const cocktail = cocktails.find((item) => item.name === normalizedName);
    return cocktail ? cloneCocktail(cocktail) : null;
  }

  function getCocktailDetail(params = {}) {
    const cocktail = getCocktailById(params.id) || getCocktailByName(params.name);
    if (!cocktail) {
      return null;
    }

    const steps = getCocktailSteps({ id: cocktail.id, name: cocktail.name });
    return {
      ...cocktail,
      history: cocktail.source === 'built-in' ? (cocktail.history || buildDefaultHistory(cocktail)) : '',
      steps
    };
  }

  function getCocktailSteps(params = {}) {
    const cocktail = getCocktailById(params.id) || getCocktailByName(params.name);
    if (!cocktail) {
      return buildFallbackSteps('鸡尾酒');
    }

    if (cocktail.source === 'custom') {
      return normalizeSteps(cocktail.steps || []);
    }

    const sourceSteps = cocktail.steps && cocktail.steps.length
      ? cocktail.steps
      : buildFallbackSteps(cocktail.name, cocktail.ingredients);

    return normalizeSteps(sourceSteps);
  }

  function getDailyCocktail(date = now()) {
    if (!cocktails.length) {
      return null;
    }

    const seedSource = toDateKey(date);
    const index = Math.abs(hashCode(seedSource)) % cocktails.length;
    return cloneCocktail(cocktails[index]);
  }

  function getCurrentDateInfo(date = now()) {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    return {
      year: date.getFullYear().toString(),
      month: months[date.getMonth()],
      day: date.getDate().toString().padStart(2, '0'),
      weekday: weekdays[date.getDay()]
    };
  }

  function saveDraft(draft) {
    const validation = cocktailDraft.validateDraft(draftToFormData(draft), {
      existingCocktails: cocktails
    });
    if (!validation.isValid) {
      throw new Error(validation.message);
    }

    const createdAt = now().toISOString();
    const cocktail = normalizeCocktail({
      ...validation.draft,
      id: createId(createdAt, validation.draft),
      createdAt,
      updatedAt: createdAt,
      source: 'custom',
      popularity: normalizePopularity(validation.draft.popularity, validation.draft.name)
    });

    customCocktails = upsertCocktail(customCocktails, cocktail);
    persistCustomCocktails();

    return cloneCocktail(cocktail);
  }

  function updateCustomCocktail(id, draft) {
    const existing = getCustomCocktailById(id);
    if (!existing) {
      throw cocktailTransfer.createTransferError(cocktailTransfer.ERROR_CODES.COCKTAIL_NOT_FOUND);
    }

    const validation = cocktailDraft.validateDraft(draftToFormData(draft), {
      checkNameConflict: false
    });
    if (!validation.isValid) {
      throw new Error(validation.message);
    }

    const hasChanged = hasCustomContentChanged(existing, validation.draft);
    if (!hasChanged) {
      return cloneCocktail(existing);
    }

    if (cocktailDraft.findNameConflict(validation.draft.name, cocktails, existing.id)) {
      throw new Error('这个酒名已经存在，请修改后再保存');
    }

    const updatedAt = now().toISOString();
    const cocktail = normalizeCocktail({
      ...existing,
      ...validation.draft,
      id: existing.id,
      createdAt: existing.createdAt || updatedAt,
      updatedAt,
      source: 'custom',
      history: '',
      popularity: normalizePopularity(existing.popularity, validation.draft.name)
    });

    customCocktails = upsertCocktail(customCocktails, cocktail);
    persistCustomCocktails();

    return cloneCocktail(cocktail);
  }

  function deleteCustomCocktail(id) {
    const normalizedId = normalizeId(id);
    const beforeLength = customCocktails.length;
    customCocktails = customCocktails.filter((cocktail) => normalizeId(cocktail.id) !== normalizedId);
    const deleted = customCocktails.length !== beforeLength;
    if (deleted) {
      persistCustomCocktails();
    }
    return deleted;
  }

  function deleteCustomCocktails(ids = []) {
    const idMap = ids.reduce((map, id) => {
      map[normalizeId(id)] = true;
      return map;
    }, {});
    const beforeLength = customCocktails.length;
    customCocktails = customCocktails.filter((cocktail) => !idMap[normalizeId(cocktail.id)]);
    const deletedCount = beforeLength - customCocktails.length;
    if (deletedCount > 0) {
      persistCustomCocktails();
    }
    return deletedCount;
  }

  function createImportPreview(text) {
    const importedDraft = cocktailTransfer.parseImportCode(text);
    return cocktailTransfer.buildImportPreview(importedDraft, cocktails);
  }

  function confirmImport(importPreview, targetName) {
    if (!importPreview || !importPreview.cocktail) {
      throw cocktailTransfer.createTransferError(cocktailTransfer.ERROR_CODES.IMPORT_CONTENT_INVALID);
    }

    const normalizedName = cocktailTransfer.validateImportTargetName(targetName, cocktails);
    const createdAt = now().toISOString();
    const draft = {
      ...importPreview.cocktail,
      name: normalizedName,
      description: importPreview.cocktail.description || cocktailDraft.DEFAULT_DESCRIPTION,
      time: importPreview.cocktail.time || cocktailDraft.DEFAULT_TIME,
      emoji: cocktailDraft.EMOJI_OPTIONS[0],
      history: ''
    };
    const validation = cocktailDraft.validateCocktail(draft, {
      existingCocktails: cocktails
    });
    if (!validation.isValid) {
      throw cocktailTransfer.createTransferError(cocktailTransfer.ERROR_CODES.IMPORT_CONTENT_INVALID);
    }

    const cocktail = normalizeCocktail({
      ...validation.draft,
      id: createId(createdAt, validation.draft),
      createdAt,
      updatedAt: createdAt,
      source: 'custom',
      emoji: cocktailDraft.EMOJI_OPTIONS[0],
      popularity: normalizePopularity(undefined, validation.draft.name)
    });

    customCocktails = upsertCocktail(customCocktails, cocktail);
    persistCustomCocktails();

    return cloneCocktail(cocktail);
  }

  function exportCustomCocktail(id) {
    const cocktail = getCocktailById(id);
    if (!cocktail) {
      throw cocktailTransfer.createTransferError(cocktailTransfer.ERROR_CODES.COCKTAIL_NOT_FOUND);
    }
    if (cocktail.source !== 'custom') {
      throw cocktailTransfer.createTransferError(cocktailTransfer.ERROR_CODES.EXPORT_NOT_CUSTOM);
    }

    const validation = cocktailDraft.validateCocktail(cocktail, {
      existingCocktails: cocktails,
      currentId: cocktail.id
    });
    if (!validation.isValid) {
      throw cocktailTransfer.createTransferError(cocktailTransfer.ERROR_CODES.EXPORT_CONTENT_INVALID, {
        errors: validation.errors,
        message: validation.message
      });
    }

    return cocktailTransfer.createImportCode(validation.draft);
  }

  function persistCustomCocktails() {
    cocktails = mergeCocktails(builtInCocktails, customCocktails);
    storageAdapter.setCustomCocktails(customCocktails.map(cloneCocktail));
  }

  return {
    init,
    listCocktails,
    listCustomCocktails,
    countCustomCocktails,
    searchCocktails,
    searchCustomCocktails,
    getCocktailById,
    getCustomCocktailById,
    getCocktailByName,
    getCocktailDetail,
    getCocktailSteps,
    getDailyCocktail,
    getCurrentDateInfo,
    saveDraft,
    updateCustomCocktail,
    deleteCustomCocktail,
    deleteCustomCocktails,
    createImportPreview,
    confirmImport,
    exportCustomCocktail
  };
}

function readCustomCocktails(storageAdapter, now) {
  try {
    const storedCocktails = storageAdapter.getCustomCocktails();
    if (!Array.isArray(storedCocktails)) {
      return {
        cocktails: [],
        changed: storedCocktails !== undefined
      };
    }

    let changed = false;
    const cocktails = storedCocktails
      .map((cocktail) => {
        const result = migrateCustomCocktail(cocktail, now);
        changed = changed || result.changed;
        return result.cocktail;
      })
      .filter((cocktail) => cocktail.name && !isBuiltInCocktail(cocktail));

    return {
      cocktails,
      changed: changed || cocktails.length !== storedCocktails.length
    };
  } catch (error) {
    console.warn('Failed to read custom cocktails:', error);
    return {
      cocktails: [],
      changed: false
    };
  }
}

function migrateCustomCocktail(cocktail, now) {
  const normalized = normalizeCocktail({
    ...cocktail,
    source: 'custom'
  });
  let changed = false;
  const timestamp = now().toISOString();

  if (!normalized.description) {
    normalized.description = cocktailDraft.DEFAULT_DESCRIPTION;
    changed = true;
  }
  if (!normalized.time) {
    normalized.time = cocktailDraft.DEFAULT_TIME;
    changed = true;
  }
  if (!normalized.createdAt) {
    normalized.createdAt = normalized.updatedAt || timestamp;
    changed = true;
  }
  if (!normalized.updatedAt) {
    normalized.updatedAt = normalized.createdAt || timestamp;
    changed = true;
  }
  if (normalized.history) {
    normalized.history = '';
    changed = true;
  }

  return {
    cocktail: normalized,
    changed
  };
}

function isBuiltInCocktail(cocktail) {
  return builtInCocktails.some((item) => normalizeId(item.id) === normalizeId(cocktail.id));
}

function mergeCocktails(baseCocktails, customItems) {
  const merged = baseCocktails.map((cocktail) => normalizeCocktail({ ...cocktail, source: 'built-in' }));
  customItems.forEach((cocktail) => {
    const normalized = normalizeCocktail({ ...cocktail, source: 'custom' });
    const index = merged.findIndex((item) => normalizeId(item.id) === normalizeId(normalized.id));
    if (index >= 0) {
      merged[index] = normalized;
    } else {
      merged.push(normalized);
    }
  });
  return merged;
}

function normalizeCocktail(cocktail) {
  const name = cocktailDraft.normalizeText(cocktail.name);
  const ingredients = Array.isArray(cocktail.ingredients)
    ? cocktail.ingredients.map((item) => cocktailDraft.normalizeText(item))
    : [];

  return {
    id: normalizeId(cocktail.id) || createCustomId(cocktail),
    name,
    emoji: cocktail.emoji || cocktailDraft.EMOJI_OPTIONS[0],
    category: cocktailDraft.normalizeText(cocktail.category) || cocktailDraft.CATEGORY_OPTIONS[0],
    description: cocktailDraft.normalizeText(cocktail.description),
    history: cocktailDraft.normalizeText(cocktail.history),
    difficulty: cocktail.difficulty || cocktailDraft.DIFFICULTY_OPTIONS[0],
    time: cocktailDraft.normalizeText(cocktail.time) || cocktailDraft.DEFAULT_TIME,
    popularity: normalizePopularity(cocktail.popularity, name),
    ingredients,
    steps: normalizeSteps(cocktail.steps || []),
    createdAt: cocktail.createdAt || '',
    updatedAt: cocktail.updatedAt || '',
    source: cocktail.source || 'custom'
  };
}

function normalizeSteps(steps) {
  if (!Array.isArray(steps)) {
    return [];
  }

  const animations = ['fadeIn', 'slideIn', 'zoomIn'];
  return steps.map((step, index) => ({
    number: index + 1,
    instruction: cocktailDraft.normalizeText(step && step.instruction),
    tips: cocktailDraft.normalizeText(step && step.tips),
    estimatedTime: cocktailDraft.normalizeStepEstimatedTime(step && step.estimatedTime),
    animation: step && step.animation ? step.animation : animations[index % animations.length]
  })).filter((step) => step.instruction);
}

function buildFallbackSteps(cocktailName, ingredients = []) {
  const ingredientText = ingredients && ingredients.length
    ? ingredients.join('、')
    : '所需材料';

  return [
    {
      number: 1,
      instruction: `准备${ingredientText}`,
      tips: '确保材料新鲜且温度适宜',
      estimatedTime: 2,
      animation: 'fadeIn'
    },
    {
      number: 2,
      instruction: `按${cocktailName}酒谱比例混合所有材料`,
      tips: '先处理需要摇和或搅拌的基酒与辅料',
      estimatedTime: 3,
      animation: 'slideIn'
    },
    {
      number: 3,
      instruction: '倒入合适杯具并完成装饰',
      tips: '杯具预冷能让口感更稳定',
      estimatedTime: 2,
      animation: 'zoomIn'
    }
  ];
}

function buildDefaultHistory(cocktail) {
  return `${cocktail.name}是一款${cocktail.category || '经典'}风格的鸡尾酒，适合在熟悉基本技法后反复练习。`;
}

function upsertCocktail(items, cocktail) {
  const nextItems = items.map(cloneCocktail);
  const index = nextItems.findIndex((item) => normalizeId(item.id) === normalizeId(cocktail.id));
  if (index >= 0) {
    nextItems[index] = cloneCocktail(cocktail);
  } else {
    nextItems.push(cloneCocktail(cocktail));
  }
  return nextItems;
}

function searchCollection(items, query) {
  const trimmedQuery = String(query || '').trim().toLowerCase();
  if (!trimmedQuery) {
    return items;
  }

  return items.filter((cocktail) => {
    const searchableText = [
      cocktail.name,
      cocktail.description,
      cocktail.difficulty,
      cocktail.category,
      ...(cocktail.ingredients || [])
    ].join(' ').toLowerCase();

    return searchableText.includes(trimmedQuery);
  });
}

function draftToFormData(draft = {}) {
  if (Object.prototype.hasOwnProperty.call(draft, 'cocktailName')) {
    return draft;
  }

  return {
    cocktailName: draft.name,
    cocktailDescription: draft.description === cocktailDraft.DEFAULT_DESCRIPTION ? '' : draft.description,
    difficulty: draft.difficulty,
    category: draft.category,
    emoji: draft.emoji,
    time: draft.time,
    ingredients: draft.ingredients,
    steps: draft.steps
  };
}

function hasCustomContentChanged(existing, draft) {
  const existingComparable = toComparableCustomContent(existing);
  const draftComparable = toComparableCustomContent(draft);
  return JSON.stringify(existingComparable) !== JSON.stringify(draftComparable);
}

function toComparableCustomContent(cocktail = {}) {
  return {
    name: cocktailDraft.normalizeText(cocktail.name),
    description: cocktailDraft.normalizeText(cocktail.description) || cocktailDraft.DEFAULT_DESCRIPTION,
    category: cocktailDraft.normalizeText(cocktail.category),
    difficulty: cocktail.difficulty || '',
    time: cocktailDraft.normalizeText(cocktail.time) || cocktailDraft.DEFAULT_TIME,
    emoji: cocktail.emoji || cocktailDraft.EMOJI_OPTIONS[0],
    ingredients: (cocktail.ingredients || []).map((item) => cocktailDraft.normalizeText(item)),
    steps: (cocktail.steps || []).map((step) => ({
      instruction: cocktailDraft.normalizeText(step && step.instruction),
      estimatedTime: cocktailDraft.normalizeStepEstimatedTime(step && step.estimatedTime),
      tips: cocktailDraft.normalizeText(step && step.tips)
    }))
  };
}

function cloneCocktail(cocktail) {
  return {
    ...cocktail,
    ingredients: [...(cocktail.ingredients || [])],
    steps: (cocktail.steps || []).map((step) => ({ ...step }))
  };
}

function normalizeId(id) {
  if (id === undefined || id === null || id === '') {
    return '';
  }
  return String(id);
}

function createCustomId(seed) {
  const source = [
    seed && seed.createdAt,
    seed && seed.name,
    seed && seed.description,
    seed && seed.idSeed
  ].filter(Boolean).join('|') || 'cocktail';
  return `custom-${Math.abs(hashCode(source)).toString(36)}`;
}

function normalizePopularity(popularity, name = '') {
  const value = parseInt(popularity, 10);
  if (!Number.isNaN(value)) {
    return Math.max(0, Math.min(100, value));
  }
  return 80 + (Math.abs(hashCode(name || 'cocktail')) % 20);
}

function decodeValue(value) {
  try {
    return decodeURIComponent(value || '');
  } catch (error) {
    return String(value || '');
  }
}

function toDateKey(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function hashCode(value) {
  const text = String(value || '');
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

module.exports = {
  CUSTOM_COCKTAILS_KEY,
  builtInCocktails: builtInCocktails.map(cloneCocktail),
  createCocktailLibrary
};
