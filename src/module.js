import './module.css!'
import _ from 'lodash'
import kbn from 'app/core/utils/kbn'
import {MetricsPanelCtrl} from 'app/plugins/sdk'
import {Builder} from './util/builder'
import {Presenter} from './util/presenter'

const panelDefaults = {
  radius: '20px',
  defaultColor: 'rgb(117, 117, 117)',
  thresholds: [],
  format: 'none',
  decimals: 2,
  mathScratchPad: 'data = size(data)[1] == 0 ? [NaN] : data',
  mathDisplayValue: 'data[end]',
  mathColorValue: 'data[end]'
}

export class StatusDotCtrl extends MetricsPanelCtrl {
  constructor ($scope, $injector) {
    super($scope, $injector)
    _.defaults(this.panel, panelDefaults)

    this.events.on('init-edit-mode', this.onInitEditMode.bind(this))
    this.events.on('data-received', this.onDataReceived.bind(this))
    this.events.on('render', this.onRender.bind(this))

    this.builder = new Builder(this.panel)
    this.presenter = new Presenter(this.panel)
  }

  onInitEditMode () {
    this.addEditorTab('Options', 'public/plugins/btplc-status-dot-panel/editor.html')
    this.addEditorTab('Values', 'public/plugins/btplc-status-dot-panel/values.html')
    this.unitFormats = kbn.getUnitFormats()
  }

  onDataReceived (seriesList) {
    this.seriesList = seriesList
    this.render()
  }

  onRender () {
    this.dots = this.builder.call(this.seriesList)
    this.presenter.call(this.dots)
  }

  onEditorSetFormat (subitem) {
    this.panel.format = subitem.value
    this.render()
  }

  onEditorAddThreshold () {
    this.panel.thresholds.push({ value: 0, color: this.panel.defaultColor })
    this.render()
  }

  onEditorRemoveThreshold (index) {
    this.panel.thresholds.splice(index, 1)
    this.render()
  }

  styleFor (dot) {
    return { 'background': dot.color, 'width': this.panel.radius, 'height': this.panel.radius }
  }

  format (value) {
    var formatFunc = kbn.valueFormats[this.panel.format]
    return formatFunc(value, this.panel.decimals, null)
  }
}

StatusDotCtrl.templateUrl = 'module.html'
export { StatusDotCtrl as PanelCtrl }
