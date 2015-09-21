module.exports = function(grunt) {

    grunt.initConfig({
        //    pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';\n'
            },
            dist: {
                src: [
                    'src/lib/jszip.min.js',
                    'src/lib/pixi.js',
                    'citrongis-core/lib/Long.min.js',
                    'citrongis-core/lib/EventEmitter.min.js',
                    'citrongis-core/lib/proj4.js',
                    'citrongis-core/lib/lru-cache.js',
                    'citrongis-core/lib/async.min.js',
                    'citrongis-core/lib/dust-full.min.js',
                    'citrongis-core/lib/less.min.js',
                    'citrongis-core/src/index.js',
                    'citrongis-core/src/utils/Comparison.js',
                    'citrongis-core/src/utils/Intersection.js',
                    'citrongis-core/src/utils/Inheritance.js',
                    'citrongis-core/src/utils/Object.js',
                    'citrongis-core/src/utils/Context.js',
                    'citrongis-core/src/utils/Path.js',
                    'citrongis-core/src/utils/Event.js',
                    'citrongis-core/src/geometry/Point.js',
                    'citrongis-core/src/geometry/Vector2.js',
                    'citrongis-core/src/geometry/Vector3.js',
                    'citrongis-core/src/geometry/BoundingBox.js',
                    'citrongis-core/src/geometry/Extent.js',
                    'citrongis-core/src/geometry/Rectangle.js',
                    'citrongis-core/src/system/Viewport.js',
                    'citrongis-core/src/helpers/CoordinatesHelper.js',
                    'citrongis-core/src/helpers/ProjectionsHelper.js',
                    'citrongis-core/src/helpers/IntersectionHelper.js',
                    'citrongis-core/src/helpers/ResolutionHelper.js',
                    'citrongis-core/src/helpers/RendererHelper.js',
                    'citrongis-core/src/extension/URLHandler.js',
                    'citrongis-core/src/extension/API.js',
                    'citrongis-core/src/extension/Require.js',
                    'citrongis-core/src/extension/UI/Include.js',
                    'citrongis-core/src/extension/UI/Trigger.js',
                    'citrongis-core/src/extension/UI/Bridge.js',
                    'citrongis-core/src/extension/UI/UI.js',
                    'citrongis-core/src/extension/Module.js',
                    'citrongis-core/src/extension/ExtensionResources.js',
                    'citrongis-core/src/extension/Extension.js',
                    'citrongis-core/src/extension/Manager.js',
                    'citrongis-core/src/geometry/LatLng.js',
                    'citrongis-core/src/geo/Feature/Feature.js',
                    'citrongis-core/src/geo/Feature/Circle.js',
                    'citrongis-core/src/geo/Feature/Image.js',
                    'citrongis-core/src/geo/Feature/Line.js',
                    'citrongis-core/src/geo/Feature/Polygon.js',
                    'citrongis-core/src/geo/Layer.js',
                    'citrongis-core/src/layer/tile/TileIndex.js',
                    'citrongis-core/src/layer/tile/TileSchema.js',
                    'citrongis-core/src/layer/tile/schema/SphericalMercator.js',
                    'citrongis-core/src/layer/tile/source/TileSource.js',
                    'citrongis-core/src/layer/tile/source/TMSSource.js',
                    'citrongis-core/src/layer/tile/TileLayer.js',
                    'citrongis-core/src/extension/LayerGroup.js',
                    'citrongis-core/src/extension/LayerManager.js',
                    'citrongis-core/src/extension/LayerHelper.js',
                    'citrongis-core/src/schema/SchemaBase.js',
                    'citrongis-core/src/schema/SphericalMercator.js',
                    'citrongis-core/src/system/Events.js',
                    'citrongis-core/src/system/TileSchemaManager.js',
                    'src/js/CitronGISDebugger.js',
                    'citrongis-core/src/renderer/RendererBase.js',
                    'src/js/Renderer/PIXIRenderer.js',
                    'citrongis-core/src/ui/PopupManager.js',
                    'citrongis-core/src/ui/Popup.js',
                    'src/js/CitronGIS.js'
                ],
                dest: 'build/citrongis.js'
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            dist: {
                files: {
                    'build/citrongis.min.js': ['build/citrongis.js']
                }
            }
        },
        copy: {
            main: {
                files: [
                    {expand: true, cwd: 'src/css/', src: ['**'], dest: 'build/css/'},
                    {expand: true, cwd: 'tests/build/', src: ['*'], dest: 'build/'},
                ],
            }
        }
        //    qunit: {
        //      files: ['test/**/*.html']
        //    },
        //    jshint: {
        //      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
        //      options: {
        //        // options here to override JSHint defaults
        //        globals: {
        //          jQuery: true,
        //          console: true,
        //          module: true,
        //          document: true
        //        }
        //      }
        //    },
        //    watch: {
        //      files: ['<%= jshint.files %>'],
        //      tasks: ['jshint', 'qunit']
        //    }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    //  grunt.loadNpmTasks('grunt-contrib-jshint');
    //  grunt.loadNpmTasks('grunt-contrib-qunit');
    //  grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');

    //  grunt.registerTask('test', ['jshint', 'qunit']);

    grunt.registerTask('default', ['copy', 'concat', 'uglify']);

};
