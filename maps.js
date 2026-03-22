const maps = [
    {
        'name': 'Contest',
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
                    {   'id': 3,    'health': 15,   'unitType': units['depot'],     'position': [8, 5]  },
                    {   'id': 4,    'health': 5,    'unitType': units['human'],     'position': [2, 30] },
                    {   'id': 5,    'health': 5,    'unitType': units['human'],     'position': [7, 15] },
                    {   'id': 6,    'health': 5,    'unitType': units['human'],     'position': [13, 20]}
                ]
            },
            {
                'money': 10,
                'energy': 0,
                'units': [
                    {   'id': 0,    'health': 15,   'unitType': units['depot'],     'position': [26, 50]},
                    {   'id': 1,    'health': 5,    'unitType': units['human'],     'position': [23, 35]},
                    {   'id': 2,    'health': 5,    'unitType': units['human'],     'position': [21, 58]},
                    {   'id': 7,    'health': 5,    'unitType': units['human'],     'position': [18, 70]}
                ]
            }
        ]
    },
    {
        'name': 'Last Outpost',
        'resourceAmount': 3, // the lower the number, the more resources are generated on the map
        'map': [
            ':                                   . . .                        ::                      :    ',
            ' ::                                    .                 .      :                       :     ',
            '                                                        .        ::                      ::   ',
            '        :                                            . . .                                 :: ',
            '      ::                                                .             ::                     :',
            '  ::::                                                   . .            ::::                  ',
            '::                                                        . . .             :::               ',
            '                                     ::::                     . .              :              ',
            '                                         ::::                  .                :             ',
            '                                                  ::                           :              ',
            '                            :::                     :::                                      :',
            '                         :::                          :::                             ::   :: ',
            '::    .                 :                  ::     ::::                                  :::   ',
            '   .                     ::                  :::::                                            ',
            '      .  ::                ::                                                                .',
            '            .  .                                                                            . ',
            '             .                                                                             . .',
            '                                            .                  .                        . . . ',
            '                                              . .             .  ::                      . .  ',
            '::                                         . .                     .   :::                  . ',
            '  :::       :::                                                       ::  ::                  ',
            '               ::                                                       :::                   ',
            '                 :::::                                                       . .              ',
            '                      ::                                            .           :: .          '
        ],
        'players': [
            {
                'money': 5,
                'energy': 0,
                'units': [
                    {   'id': 0,    'health': 15,   'unitType': units['depot'],     'position': [1, 17]  },
                    {   'id': 1,    'health': 5,    'unitType': units['human'],     'position': [5, 13] },
                    {   'id': 2,    'health': 5,    'unitType': units['human'],     'position': [3, 22] },
                    {   'id': 3,    'health': 5,    'unitType': units['turret'],    'position': [3, 30] },
                    {   'id': 4,    'health': 5,    'unitType': units['turret'],    'position': [7, 10] }
                ]
            },
            {
                'money': 10,
                'energy': 0,
                'units': [
                    {   'id': 5,    'health': 15,   'unitType': units['depot'],     'position': [22, 62]},

                    {   'id': 6,    'health': 5,    'unitType': units['human'],     'position': [21, 50]},
                    {   'id': 7,    'health': 5,    'unitType': units['human'],     'position': [20, 81]},
                    {   'id': 8,    'health': 5,    'unitType': units['human'],     'position': [18, 65]}
                ]
            }
        ]
    }
]