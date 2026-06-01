<template>
  <div class="algolia-search-wrapper search-box">
    <button
      type="button"
      class="search-trigger"
      aria-label="打开搜索"
      @click="openModal"
    >
      <span class="search-trigger-icon" aria-hidden="true"></span>
      <span class="search-trigger-text">搜索</span>
    </button>

    <transition name="search-modal">
      <div
        ref="modalMask"
        v-show="isOpen"
        class="search-modal-mask"
        @click.self="closeModal"
      >
        <section
          class="search-modal-panel"
          role="dialog"
          aria-modal="true"
          aria-label="站内搜索"
        >
          <div class="search-modal-head">
            <div class="search-modal-input-wrap">
              <span class="search-modal-icon" aria-hidden="true"></span>
              <form
                id="search-form"
                class="search-modal-form"
                role="search"
                @submit.prevent
              >
                <input
                  id="algolia-search-input"
                  ref="searchInput"
                  class="search-query"
                  :placeholder="placeholder"
                  @input="searchValue = $event.target.value"
                >
              </form>
            </div>
            <button
              type="button"
              class="search-modal-close"
              aria-label="关闭搜索"
              @click="closeModal"
            >
              ×
            </button>
          </div>
          <div
            ref="resultsPanel"
            class="search-modal-results"
            :class="{ 'has-query': searchValue }"
            @mousedown.prevent
          ></div>
        </section>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'AlgoliaSearchBox',

  props: ['options'],

  data () {
    return {
      isOpen: false,
      searchValue: '',
      placeholder: undefined,
      previousBodyOverflow: ''
    }
  },

  watch: {
    $lang (newValue) {
      this.update(this.options, newValue)
    },

    options (newValue) {
      this.update(newValue, this.$lang)
    },

    $route () {
      this.closeModal()
    }
  },

  mounted () {
    this.initialize(this.options, this.$lang)
    this.placeholder = this.$site.themeConfig.searchPlaceholder || '搜索文档'
    this.mountModal()
    document.addEventListener('keydown', this.handleKeydown)
  },

  beforeDestroy () {
    document.removeEventListener('keydown', this.handleKeydown)
    this.restoreBodyOverflow()
    this.unmountModal()
  },

  methods: {
    initialize (userOptions, lang) {
      Promise.all([
        import(/* webpackChunkName: "docsearch" */ 'docsearch.js/dist/cdn/docsearch.min.js'),
        import(/* webpackChunkName: "docsearch" */ 'docsearch.js/dist/cdn/docsearch.min.css')
      ]).then(([docsearch]) => {
        docsearch = docsearch.default
        const { algoliaOptions = {}, autocompleteOptions = {} } = userOptions
        docsearch(Object.assign(
          {},
          userOptions,
          {
            inputSelector: '#algolia-search-input',
            autocompleteOptions: {
              minLength: 2,
              debounce: 350,
              ...autocompleteOptions,
              debug: true
            },
            // #697 Make docsearch work well at i18n mode.
            algoliaOptions: {
              ...algoliaOptions,
              facetFilters: [`lang:${lang}`].concat(algoliaOptions.facetFilters || [])
            },
            handleSelected: (input, event, suggestion) => {
              const { pathname, hash } = new URL(suggestion.url)
              const routepath = pathname.replace(this.$site.base, '/')
              const _hash = decodeURIComponent(hash)
              this.closeModal()
              this.$router.push(`${routepath}${_hash}`)
            }
          }
        ))
        this.$nextTick(this.mountDropdown)
      })
    },

    update (options, lang) {
      this.initialize(options, lang)
    },

    mountModal () {
      if (this.$refs.modalMask && this.$refs.modalMask.parentNode !== document.body) {
        document.body.appendChild(this.$refs.modalMask)
      }
    },

    unmountModal () {
      if (this.$refs.modalMask && this.$refs.modalMask.parentNode) {
        this.$refs.modalMask.parentNode.removeChild(this.$refs.modalMask)
      }
    },

    mountDropdown () {
      const dropdown = this.$el.querySelector('.ds-dropdown-menu') || document.querySelector('.ds-dropdown-menu')
      if (dropdown && this.$refs.resultsPanel && dropdown.parentNode !== this.$refs.resultsPanel) {
        this.$refs.resultsPanel.appendChild(dropdown)
      }
    },

    openModal () {
      this.isOpen = true
      this.lockBodyOverflow()
      this.$nextTick(() => {
        this.mountDropdown()
        if (this.$refs.searchInput) {
          this.$refs.searchInput.focus()
        }
      })
    },

    closeModal () {
      this.isOpen = false
      this.restoreBodyOverflow()
    },

    lockBodyOverflow () {
      if (document.body.style.overflow !== 'hidden') {
        this.previousBodyOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
      }
    },

    restoreBodyOverflow () {
      document.body.style.overflow = this.previousBodyOverflow
    },

    handleKeydown (event) {
      if (event.key === 'Escape' && this.isOpen) {
        this.closeModal()
      }
      if ((event.ctrlKey || event.metaKey) && event.key && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        this.openModal()
      }
    }
  }
}
</script>

<style lang="stylus">
.algolia-search-wrapper
  position relative
  line-height normal
  .search-trigger
    display inline-flex
    align-items center
    justify-content center
    height $navbarHeight - 1.4rem
    min-width $navbarHeight - 1.4rem
    padding 0 .65rem
    color inherit
    background transparent
    border 0
    border-radius 4px
    box-sizing border-box
    cursor pointer
    font-weight bold
    transition color .2s, background-color .2s, opacity .2s
    &:hover,
    &:focus
      color #fff
  .search-trigger-icon
    width .95rem
    height .95rem
    border 2px solid currentColor
    border-radius 50%
    box-sizing border-box
    position relative
    flex none
    &:after
      content ''
      position absolute
      width .42rem
      height 2px
      right -.34rem
      bottom -.18rem
      background currentColor
      border-radius 2px
      transform rotate(45deg)
      transform-origin center
  .search-trigger-text
    margin-left .45rem
    font-size .9rem
    line-height 1

.search-modal-icon
  width .95rem
  height .95rem
  border 2px solid currentColor
  border-radius 50%
  box-sizing border-box
  position relative
  flex none
  &:after
    content ''
    position absolute
    width .42rem
    height 2px
    right -.34rem
    bottom -.18rem
    background currentColor
    border-radius 2px
    transform rotate(45deg)
    transform-origin center

.search-modal-mask
  position fixed
  z-index 1000
  top 0
  right 0
  bottom 0
  left 0
  width 100vw
  height 100vh
  padding 12vh 1rem 1rem
  background rgba(0, 0, 0, .42)
  backdrop-filter saturate(140%) blur(8px)
  box-sizing border-box

.search-modal-mask
  .search-modal-panel
    width 100%
    max-width 44rem
    margin 0 auto
    background var(--mainBg)
    color var(--textColor)
    border 1px solid var(--borderColor)
    border-radius 8px
    box-shadow 0 18px 48px rgba(0, 0, 0, .26)
    overflow hidden
  .search-modal-head
    display flex
    align-items center
    gap .75rem
    padding .85rem
    border-bottom 1px solid var(--borderColor)
  .search-modal-input-wrap
    flex 1 1 auto
    display flex
    align-items center
    min-width 0
    height 3rem
    padding 0 1rem
    color var(--textLightenColor)
    background rgba(127, 127, 127, .08)
    border 1px solid var(--borderColor)
    border-radius 6px
    box-sizing border-box
    transition border-color .2s, box-shadow .2s, background-color .2s
    &:focus-within
      background var(--mainBg)
      border-color $accentColor
      box-shadow 0 0 0 3px rgba(17, 168, 205, .16)
  .search-modal-form,
  .algolia-autocomplete
    flex 1 1 auto
    min-width 0
    width 100%
  .search-query
    display block
    width 100%
    height 2.7rem
    padding 0 0 0 .85rem
    color var(--textColor)
    background transparent
    border 0
    box-sizing border-box
    font-size 1rem
    line-height 2.7rem
    outline none
    &::placeholder
      color var(--textColor)
      opacity .5
  .search-modal-close
    flex 0 0 auto
    width 2.7rem
    height 2.7rem
    padding 0
    color var(--textColor)
    background transparent
    border 1px solid transparent
    border-radius 6px
    cursor pointer
    font-size 1.7rem
    line-height 2.4rem
    opacity .72
    transition color .2s, background-color .2s, opacity .2s
    &:hover,
    &:focus
      color $accentColor
      background rgba(17, 168, 205, .1)
      opacity 1
  .search-modal-results
    position relative
    min-height 12rem
    max-height 58vh
    overflow-y auto
    background var(--mainBg)
    &:before
      content '输入关键词后，搜索结果会显示在这里'
      position absolute
      top 50%
      left 1rem
      right 1rem
      color var(--textColor)
      font-size .95rem
      line-height 1.6
      text-align center
      opacity .52
      transform translateY(-50%)
    &.has-query:before
      display none
  .algolia-autocomplete
    line-height normal
  .search-modal-results
    .ds-dropdown-menu
      position static !important
      top auto !important
      left auto !important
      right auto !important
      display block !important
      width 100% !important
      min-width 0 !important
      max-width none !important
      margin 0
      padding .35rem
      color var(--textColor)
      background transparent
      border 0
      border-radius 0
      box-shadow none
      box-sizing border-box
      text-align left
      &:before
        display none
      [class*=ds-dataset-]
        border none
        padding 0
      .ds-suggestions
        margin-top 0
      .ds-suggestion
        border-bottom 1px solid var(--borderColor)
        &:last-child
          border-bottom 0
    .algolia-docsearch-suggestion--highlight
      color $accentColor
      background rgba(17, 168, 205, .12)
    .algolia-docsearch-suggestion
      border-color var(--borderColor)
      padding 0
      .algolia-docsearch-suggestion--category-header
        padding .55rem .75rem
        margin-top 0
        background $accentColor
        color #fff
        font-weight 600
        border-radius 5px 5px 0 0
        .algolia-docsearch-suggestion--highlight
          background rgba(255, 255, 255, .28)
          color #fff
      .algolia-docsearch-suggestion--wrapper
        padding 0
      .algolia-docsearch-suggestion--title
        font-weight 600
        margin-bottom .12rem
        color var(--textColor)
      .algolia-docsearch-suggestion--text
        color var(--textColor)
        opacity .78
      .algolia-docsearch-suggestion--subcategory-column
        vertical-align top
        padding .65rem .7rem
        border-color var(--borderColor)
        background rgba(127, 127, 127, .08)
        &:after
          display none
      .algolia-docsearch-suggestion--subcategory-column-text
        color var(--textColor)
        opacity .7
      .algolia-docsearch-suggestion--content
        padding .65rem .85rem
    .algolia-docsearch-footer
      border-color var(--borderColor)
      color var(--textColor)
      opacity .7
    .ds-cursor .algolia-docsearch-suggestion--content
      background-color rgba(17, 168, 205, .1) !important
      color var(--textColor)

.search-modal-enter-active,
.search-modal-leave-active
  transition opacity .18s ease
  .search-modal-panel
    transition transform .18s ease, opacity .18s ease
.search-modal-enter,
.search-modal-leave-to
  opacity 0
  .search-modal-panel
    opacity 0
    transform translateY(-10px) scale(.98)

@media (min-width: $MQMobile)
  .search-modal-mask
    .search-modal-results
      .algolia-docsearch-suggestion
        .algolia-docsearch-suggestion--subcategory-column
          float none
          width 145px
          min-width 145px
          display table-cell
        .algolia-docsearch-suggestion--content
          float none
          display table-cell
          width 100%
          vertical-align top

@media (max-width: $MQMobile)
  .algolia-search-wrapper
    .search-trigger
      width 2.15rem
      padding 0
    .search-trigger-text
      display none
  .search-modal-mask
    padding 4.6rem .75rem .75rem
    .search-modal-panel
      width 100%
      border-radius 7px
    .search-modal-head
      padding .65rem
      gap .55rem
    .search-modal-input-wrap
      height 2.7rem
      padding 0 .8rem
    .search-query
      height 2.4rem
      line-height 2.4rem
      font-size .95rem
    .search-modal-close
      width 2.4rem
      height 2.4rem
      line-height 2.1rem
    .search-modal-results
      min-height 10rem
      max-height calc(100vh - 10rem)
      .ds-dropdown-menu
        width 100% !important
        max-width none !important
      .algolia-docsearch-suggestion--wrapper
        padding .45rem .55rem !important
      .algolia-docsearch-suggestion--subcategory-column
        padding 0 !important
        background transparent !important
      .algolia-docsearch-suggestion--subcategory-column-text:after
        content " > "
        font-size 10px
        line-height 14.4px
        display inline-block
        width 5px
        margin -3px 3px 0
        vertical-align middle
</style>
