console.log('hi?')

const maps = [
    {
        'name': 'testmap',
        'resourceAmount': 3, // the lower the number, the more resources are generated on the map
        'map': [
            '                                                                         :                    ',
            '  ::::                                                                 ::                     ',
            '::    ::::                                    . .                    ::                       ',
            '          :::::                              . .                       :                      ',
            '               :                                                                              ',
            '                ::::::       ::                                                               ',
            '                               :::                                       :                  ::',
            '                                  :                                       :::             ::  ',
            '                                   :                                         ::        :::    ',
            '                                :::                                            :::            ',
            '                    ::::    ::::                                                              ',
            '                ::::    ::::                            :                                     ',
            '            ::::                                      ::       :                              ',
            '          ::                                        ::          ::                            ',
            '        ::                                      ::::             ::                           ',
            '                                              ::              :::                        . . .',
            '::                                              :::    ::                             . . . . ',
            '  ::                                               ::::                            . . .   . .',
            '                                                                              . . . .         ',
            '                                                                                 .            ',
            '                                                                                              ',
            '                          . . .                                  . .                          ',
            '                       . . .                                    . . . .                       ',
            '                  . .  :::  .                                        . .                      ',
            '                         . .                                                                  ',
            '                                                                                              ',
            '                               .                                               :::::          ',
            '                          . . .                                              ::     ::      ::',
            '                           . :::                                         ::::                 ',
            '                              . :                                      ::                     '
        ],
        'players': [
            {
                'money': 10,
                'energy': 0,
                'units': [
                    {
                        'id': 3,
                        'health': 15,
                        'unitType': units['depot'],
                        'position': [8, 5]
                    },
                    {
                        'id': 4,
                        'health': 5,
                        'unitType': units['human'],
                        'position': [2, 30]
                    },
                    {
                        'id': 5,
                        'health': 5,
                        'unitType': units['human'],
                        'position': [7, 15]
                    }
                ]
            },
            {
                'money': 10,
                'energy': 0,
                'units': [
                    {
                        'id': 0,
                        'health': 15,
                        'unitType': units['depot'],
                        'position': [26, 50]
                    },
                    {
                        'id': 1,
                        'health': 5,
                        'unitType': units['human'],
                        'position': [23, 35]
                    },
                    {
                        'id': 2,
                        'health': 5,
                        'unitType': units['human'],
                        'position': [21, 58]
                    }
                ]
            }
        ]
    }
]