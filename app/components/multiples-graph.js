import Ember from 'ember';
const {computed, observer} = Ember;

export default Ember.Component.extend({
  classNames: ['multiples'],
  margin: { top: 20, right: 15, bottom: 30, left: 35 },
  height: 140,
  width: computed(function() {
    return this.$('.multiple:first').width() - this.get('margin.left') - this.get('margin.right');
  }),
  id: computed('elementId', function() {
    return `#${this.get('elementId')}`;
  }),
  xExtent: computed('data', function() {
    return d3.extent(this.get('data'), function(d) { return d.year;} );
  }),
  xRange: computed('data', function() {
    return  _.chain( this.get('data') )
      .pluck('year')
      .uniq()
      .value();
  }),
  varId: computed(function() {
    return 'name';
  }),
  nestedData: computed('data', function() {
    let key = this.get('varId');
    let xRange = this.get('xRange');
    let varDependent = this.get('varDependent');
    var nest = d3.nest()
      .key(function(d) { return Ember.get(d, key); })
      .entries(this.get('data'));

    nest = _.chain(nest)
      .toArray()
      .filter(function(d) { return d.values.length === xRange.length; })
      .value();

    return _.sortBy(nest, function(d) {
       return -Ember.get(_.last(d.values), varDependent);
    }).slice(0, 40); //last year data
  }),
  formatNumber: function(num) {
    var prefix = d3.formatPrefix(num);
    return prefix.scale(num).toFixed(0) + prefix.symbol.replace(/G/,'B');
  },
  truncateYear: function(year) {
    return '’' + year.toString().slice(-2);
  },
  maxValue: computed(function () {
    let nestedData = this.get('nestedData');
    let varDependent = this.get('varDependent');
    nestedData.forEach(function(year) {
      year.maxValue = d3.max(year.values, function(d) { return Ember.get(d, varDependent); });
    });
    return d3.max(nestedData, function(d) { return d.maxValue; });
  }),
  xScale: computed('width', function() {
    return d3.scale.linear()
      .domain(this.get('xExtent'))
      .range([ 0, this.get('width') ]);
  }),
  yScale: computed('height', function() {
    return d3.scale.linear()
      .range([ this.get('height'), 0 ])
      .domain([ 0, this.get('maxValue')]);
  }),
  yAxis: computed(function() {
    return d3.svg.axis()
    .scale(this.get('yScale'))
    .ticks(3)
    .tickFormat((d) => { return'$'+this.formatNumber(d); })
    .outerTickSize(0)
    .tickSize(-this.get('width'))
    .orient('left');
  }),
  area: computed(function() {
    let varDependent = this.get('varDependent');
    return d3.svg.area()
      .x((d) => { return this.get('xScale')(d.year); })
      .y((d) => { return this.get('yScale')(Ember.get(d, varDependent)); })
      .y0(this.get('height'));
  }),
  line: computed(function() {
    let varDependent = this.get('varDependent');
    return d3.svg.line()
      .x((d) => { return this.get('xScale')(d.year); })
      .y((d) => { return this.get('yScale')(Ember.get(d, varDependent)); });
  }),
  initCharts: function() {

    let data = this.get('nestedData');

    var container = d3.select(this.get('id')).selectAll('div')
      .data(data, function(d,i) { return [d.key, i]; });

    var div = container.enter().append('div')
      .attr('class', 'multiple');

    let margin = this.get('margin');
    let x = this.get('xScale');
    let y = this.get('yScale');
    let w = this.get('width');
    let h = this.get('height');
    let yAxis = this.get('yAxis');
    let line = this.get('line');
    let area = this.get('area');
    let formatNumber = this.get('formatNumber');
    let truncateYear = this.get('truncateYear');
    let varDependent = this.get('varDependent');

    div.append('h3')
      .attr('class', 'chart__title')
      .text(function(d) { return d.key; });

    var svg = div.append('svg')
      .attr('class', 'chart__wrap')
      .attr('width', w + margin.left + margin.right)
      .attr('height', h + margin.top + margin.bottom)
    .append('g')
      .attr('class', 'chart')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    svg.append('rect')
      .attr('class', 'background')
      .attr('width', w)
      .attr('height', h)
      .on('mouseover', mouseover)
      .on('mousemove', mousemove)
      .on('mouseout', mouseout);

    svg.append('text')
      .attr('class', 'static_year')
      .attr('text-anchor', 'start')
      .attr('dy', 13)
      .attr('y', h)
      .attr('x', 0)
      .text('’08');

    svg.append('text')
      .attr('class', 'static_year')
      .attr('text-anchor', 'end')
      .attr('dy', 13)
      .attr('y', h)
      .attr('x', w)
      .text('’13');

    svg.append('g')
      .attr('class', 'axis axis--y')
      .call(yAxis);

    svg.append('path')
      .attr('class', 'area')
      .attr('d', function(d) { return area(d.values); });

    svg.append('path')
      .attr('class', 'line')
      .attr('d', function(d) {
        return line(d.values);
      });

    var hoverMarker = svg.append('rect')
      .classed('marker', true)
      .attr('width', 5)
      .attr('height', 5)
      .attr('opacity', 0);

    var caption = svg.append('text')
      .attr('class', 'caption')
      .attr('text-anchor', 'middle')
      .attr('dy', -8);

    var curYear = svg.append('text')
      .attr('class', 'year')
      .attr('text-anchor', 'middle')
      .attr('dy', 13)
      .attr('y', h);

    function mouseover() {
      hoverMarker.attr('opacity', 1);
      d3.selectAll('.static_year').classed( 'hidden', true);
      mousemove.call(this);
    }

    function mousemove() {
      var year = x.invert(d3.mouse( this)[ 0 ]);
      var date = Math.round(year);
      var bisect = d3.bisector(function(d) { return d.year; }).left;
      var index = 0;

      hoverMarker.attr('x', x(date))
        .attr('y', function(d) {
          index = bisect(d.values, date, 0, d.values.length - 1);

          let yValue = Ember.get(d.values[index], varDependent);
          return y(yValue);
        })
        .attr('transform', function(d) {
          let yValue = Ember.get(d.values[index], varDependent);
          return 'translate(0, -3.54) rotate( 45 ' + x(date) + ' ' + y(yValue) + ')';
        });

      caption.attr('x', x(date))
        .attr('y', function(d) {
          let yValue = Ember.get(d.values[index], varDependent);
          return y(yValue);
        })
        .text(function(d) {
          let yValue = Ember.get(d.values[index], varDependent);
          return '$' + formatNumber(yValue);
        });

      curYear.attr('x', x(date))
        .text(truncateYear(date));
    }

    function mouseout() {
      hoverMarker.attr('opacity', 0);
      d3.selectAll('.static_year').classed('hidden', false);
      caption.text('');
      curYear.text('');
    }
    container.exit().remove();
  },
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      this.initCharts();
    });
  },
  update: observer('data.[]', 'varDependent', 'dataType', 'vis', function() {
    Ember.run.scheduleOnce('afterRender', this , function() {
      this.initCharts();
    });
  })
});

